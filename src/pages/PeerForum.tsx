import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Plus, Clock, User, Eye, AlertCircle, CheckCircle } from 'lucide-react';

interface PeerPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  approved: boolean;
  user_id: string;
  peer_post_replies?: {
    id: string;
    content: string;
    created_at: string;
    is_anonymous: boolean;
    user_id: string;
  }[];
}

const PeerForum = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PeerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    is_anonymous: true
  });
  const [selectedPost, setSelectedPost] = useState<PeerPost | null>(null);
  const [newReply, setNewReply] = useState({
    content: '',
    is_anonymous: true
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('peer_posts')
        .select(`
          *,
          peer_post_replies(*)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load forum posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('peer_posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          is_anonymous: newPost.is_anonymous,
          user_id: user?.id,
          approved: false // Posts need approval
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been submitted for review. It will appear once approved by a counselor.",
      });

      setNewPost({
        title: '',
        content: '',
        is_anonymous: true
      });
      setShowCreateDialog(false);

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (postId: string) => {
    if (!newReply.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('peer_post_replies')
        .insert({
          post_id: postId,
          content: newReply.content,
          is_anonymous: newReply.is_anonymous,
          user_id: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your reply has been posted.",
      });

      setNewReply({
        content: '',
        is_anonymous: true
      });

      // Refresh posts to show new reply
      fetchPosts();

    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Peer Support Forum</h1>
          <p className="text-muted-foreground">
            Connect with fellow students, share experiences, and support each other
          </p>
        </div>
        
        {userRole === 'student' && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts or ask for support. Your post will be reviewed before appearing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's on your mind?"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, experiences, or questions..."
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={newPost.is_anonymous}
                    onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, is_anonymous: checked }))}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Post anonymously
                  </Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero">
                    Submit for Review
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Guidelines */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-accent" />
            Community Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Be respectful and supportive of others</li>
            <li>• Share experiences that might help others</li>
            <li>• Avoid sharing personal identifying information</li>
            <li>• All posts are reviewed by counselors before appearing</li>
            <li>• If you're in crisis, please contact emergency services immediately</li>
          </ul>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.is_anonymous ? 'Anonymous' : 'Student'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.peer_post_replies?.length || 0} replies
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                
                {/* Replies */}
                {post.peer_post_replies && post.peer_post_replies.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Replies
                    </h4>
                    <div className="space-y-3">
                      {post.peer_post_replies.map((reply) => (
                        <div key={reply.id} className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{reply.is_anonymous ? 'Anonymous' : 'Student'}</span>
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(reply.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reply Form */}
                {userRole === 'student' && (
                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-3">
                      <Label htmlFor={`reply-${post.id}`}>Add a reply</Label>
                      <Textarea
                        id={`reply-${post.id}`}
                        placeholder="Share your thoughts or support..."
                        rows={3}
                        value={selectedPost?.id === post.id ? newReply.content : ''}
                        onChange={(e) => {
                          setSelectedPost(post);
                          setNewReply(prev => ({ ...prev, content: e.target.value }));
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`reply-anonymous-${post.id}`}
                            checked={newReply.is_anonymous}
                            onCheckedChange={(checked) => setNewReply(prev => ({ ...prev, is_anonymous: checked }))}
                          />
                          <Label htmlFor={`reply-anonymous-${post.id}`} className="text-sm">
                            Reply anonymously
                          </Label>
                        </div>
                        <Button
                          size="sm"
                          variant="calm"
                          onClick={() => handleReply(post.id)}
                          disabled={!newReply.content.trim() || selectedPost?.id !== post.id}
                        >
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your thoughts and start a conversation!
              </p>
              {userRole === 'student' && (
                <Button variant="hero" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PeerForum;