"use client"

import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useLists } from "@/hooks/useList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Pencil, Plus, ShoppingCart, Trash2, X, List } from "lucide-react"
import DeleteConfirm from "@/components/common/DeleteConfirm"

const CATEGORIES = ["Grocery", "Public Market", "Personal", "Household", "Other"]

function Lists() {
  const { lists, createList, deleteList, updateList, addItemToList, toggleItemComplete, deleteItem, updateItemName, uncheckAllItems } = useLists()
  const [newListName, setNewListName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewListId, setViewListId] = useState<string | null>(null)
  const [viewItemInput, setViewItemInput] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteListTarget, setDeleteListTarget] = useState<typeof selectedList>(null)
  const [deleteItemTarget, setDeleteItemTarget] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemName, setEditingItemName] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editCategory, setEditCategory] = useState(CATEGORIES[0])

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName, selectedCategory)
      setNewListName("")
    }
  }

  const selectedList = useMemo(() => {
    if (!viewListId) return null
    return lists.find((l) => l.id === viewListId) ?? null
  }, [lists, viewListId])

  const openView = (listId: string) => {
    setViewListId(listId)
    setViewItemInput("")
    setIsViewOpen(true)
  }

  const openEdit = (list: typeof selectedList) => {
    if (!list) return
    setViewListId(list.id)
    setEditName(list.name)
    setEditCategory(list.category)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedList) return
    updateList(selectedList.id, editName, editCategory)
    setIsEditOpen(false)
  }

  const startEditItem = (itemId: string, currentName: string) => {
    setEditingItemId(itemId)
    setEditingItemName(currentName)
  }

  const saveEditItem = () => {
    if (!selectedList || !editingItemId || !editingItemName.trim()) return
    updateItemName(selectedList.id, editingItemId, editingItemName.trim())
    setEditingItemId(null)
    setEditingItemName("")
  }

  const handleAddItemInView = () => {
    if (!viewListId) return
    const itemName = viewItemInput.trim()
    if (!itemName) return
    addItemToList(viewListId, itemName)
    setViewItemInput("")
  }

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto mt-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ">
        <Dialog>
          <DialogTrigger asChild>
            <Button className=" gap-2" size="md" variant="default">
              <List /> Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  placeholder="e.g., Weekly Groceries"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleCreateList} className="w-full">
                Create List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="p-14 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lists yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {lists.map((list) => (
            <button
              key={list.id}
              type="button"
              onClick={() => openView(list.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openView(list.id)
                }
              }}
              className="w-full text-left"
              aria-label={`Open list ${list.name}`}
            >
              <Card className="shadow-sm rounded-2xl transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring p-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-background">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-lg min-w-0 wrap-break-word overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                        {list.name}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground">{list.category}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label="Edit list"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEdit(list)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                      aria-label="Delete list"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteListTarget(list)
                        setShowDeleteConfirm(true)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">List:</div>
                  {list.items.length === 0 ? (
                    <div className="mt-1 text-sm text-muted-foreground">No items yet</div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {list.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {item.name}
                        </div>
                      ))}
                      {list.items.length > 2 && (
                        <div className="text-sm text-muted-foreground">+{list.items.length - 2} more</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open)
          if (!open) {
            setViewListId(null)
            setViewItemInput("")
            setShowDeleteConfirm(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedList?.name ?? "List"}</DialogTitle>
            {selectedList?.category ? <div className="text-sm text-muted-foreground">{selectedList.category}</div> : null}
          </DialogHeader>

          {!selectedList ? (
            <div className="text-sm text-muted-foreground">List not found.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">{selectedList.items.length} items</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => uncheckAllItems(selectedList.id)}
                  disabled={selectedList.items.length === 0}
                >
                  Reset checks
                </Button>
              </div>

              <Separator />

              {selectedList.items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No items yet. Add one below.</div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedList.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-1">
                      {editingItemId === item.id ? (
                        /* Inline edit row */
                        <>
                          <Input
                            className="h-8 flex-1 text-sm"
                            value={editingItemName}
                            autoFocus
                            onChange={(e) => setEditingItemName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditItem()
                              if (e.key === "Escape") { setEditingItemId(null); setEditingItemName("") }
                            }}
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={saveEditItem} aria-label="Save">
                            <Plus className="h-4 w-4 rotate-45" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => { setEditingItemId(null); setEditingItemName("") }} aria-label="Cancel">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        /* Normal row */
                        <>
                          <button
                            type="button"
                            className="flex flex-1 items-center gap-3 text-left px-1 py-1 border-b border-muted-foreground -mx-1 -my-1 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            onClick={() => toggleItemComplete(selectedList.id, item.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                toggleItemComplete(selectedList.id, item.id)
                              }
                            }}
                            aria-label={`Toggle ${item.name}`}
                          >
                            <span className="pointer-events-none">
                              <Checkbox checked={item.completed} />
                            </span>
                            <span className={`flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.name}
                            </span>
                          </button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditItem(item.id, item.name)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                            aria-label="Edit item"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteItemTarget(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                            aria-label="Delete item"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Input
                  placeholder="Add item..."
                  value={viewItemInput}
                  onChange={(e) => setViewItemInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddItemInView()
                    }
                  }}
                />
                <Button onClick={handleAddItemInView} className="gap-2" disabled={!viewItemInput.trim()}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 sm:mt-8">
            <div className="flex w-full flex-row justify-between items-center gap-2">
              {selectedList ? (
                <div />
              ) : (
                <div />
              )}
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete list confirm */}
      <DeleteConfirm
        open={showDeleteConfirm}
        onOpenChange={(open) => { if (!open) { setShowDeleteConfirm(false); setDeleteListTarget(null) } }}
        title="Delete List"
        description={`Are you sure you want to delete "${deleteListTarget?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteListTarget) deleteList(deleteListTarget.id)
          setDeleteListTarget(null)
          setIsViewOpen(false)
        }}
      />

      {/* Delete item confirm */}
      <DeleteConfirm
        open={deleteItemTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteItemTarget(null) }}
        title="Delete Item"
        description="Remove this item from the list?"
        onConfirm={() => {
          if (selectedList && deleteItemTarget) deleteItem(selectedList.id, deleteItemTarget)
          setDeleteItemTarget(null)
        }}
      />

      {/* Edit list dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-list-name">List Name</Label>
              <Input
                id="edit-list-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={!editName.trim()}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute("/List")({
  component: Lists,
})
