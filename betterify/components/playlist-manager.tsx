"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  type Playlist,
  initializeDefaultPlaylists,
} from "@/lib/playlist-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const { toast } = useToast()

  // Load playlists on mount
  useEffect(() => {
    initializeDefaultPlaylists()
    setPlaylists(getPlaylists())
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle creating a new playlist
  const handleCreatePlaylist = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      })
      return
    }

    const newPlaylist = createPlaylist(formData.name, formData.description)
    setPlaylists(getPlaylists())
    setFormData({ name: "", description: "" })
    setIsCreating(false)

    toast({
      title: "Playlist Created",
      description: `"${newPlaylist.name}" has been created.`,
    })
  }

  // Handle updating a playlist
  const handleUpdatePlaylist = () => {
    if (!selectedPlaylist) return
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      })
      return
    }

    const updatedPlaylist = updatePlaylist(selectedPlaylist.id, {
      name: formData.name,
      description: formData.description,
    })

    if (updatedPlaylist) {
      setPlaylists(getPlaylists())
      setFormData({ name: "", description: "" })
      setSelectedPlaylist(null)
      setIsEditing(false)

      toast({
        title: "Playlist Updated",
        description: `"${updatedPlaylist.name}" has been updated.`,
      })
    }
  }

  // Handle deleting a playlist
  const handleDeletePlaylist = (playlist: Playlist) => {
    const success = deletePlaylist(playlist.id)

    if (success) {
      setPlaylists(getPlaylists())
      toast({
        title: "Playlist Deleted",
        description: `"${playlist.name}" has been deleted.`,
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setFormData({
      name: playlist.name,
      description: playlist.description || "",
    })
    setIsEditing(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Playlists</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>Give your playlist a name and optional description.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Awesome Playlist"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A collection of my favorite songs"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Playlist Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>Update your playlist details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="My Awesome Playlist"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="A collection of my favorite songs"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePlaylist}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Playlist List */}
      <div className="space-y-2">
        {playlists.length === 0 ? (
          <p className="text-center text-neutral-500 py-4">No playlists found. Create one to get started.</p>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md"
            >
              <div>
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(playlist)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleDeletePlaylist(playlist)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

