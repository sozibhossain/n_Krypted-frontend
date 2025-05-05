"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/use-queries";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Image from "next/image";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { apiService } from "@/lib/api-service";
import { useSession } from "next-auth/react";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}
export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useAllCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const updateCategoryMutation = useUpdateCategory();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [categories, setCategories] = useState<any>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const session = useSession();
  const user = session.data?.user;

  // Set token whenever user changes
  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data);
      // Calculate total pages based on your desired items per page (e.g., 5)
      setTotalPages(Math.ceil((categoriesData.data as any[]).length / 5));
    }
  }, [categoriesData]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (isEdit && selectedCategory) {
        setSelectedCategory({
          ...selectedCategory,
          image: URL.createObjectURL(file),
        });
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setEditPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setNewCategory({ ...newCategory, image: file });
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name || !newCategory.description || !newCategory.image) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);

    createCategoryMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewCategory({ name: "", description: "", image: null });
        setPreviewUrl("");
      },
    });
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditPreviewUrl(category.image);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) return;

    const formData = new FormData();
    formData.append("name", selectedCategory.name);
    formData.append("description", selectedCategory.description);

    if (editPreviewUrl !== selectedCategory.image) {
      // This means the image was changed
      const response = await fetch(editPreviewUrl);
      const blob = await response.blob();
      formData.append("image", blob);
    }

    updateCategoryMutation.mutate(
      { id: selectedCategory._id, data: formData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedCategory(null);
        },
      }
    );
  };

  const handleDeleteCategory = async (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const displayedCategories = categories.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your Categories</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6b614f] hover:bg-[#5c5343]">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Type category name here..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Type category description here..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Thumbnail</Label>
                  <div className="border rounded-md p-4">
                    {previewUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-40 object-contain"
                          width={200}
                          height={200}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPreviewUrl("");
                            setNewCategory({ ...newCategory, image: null });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                          {/* <Image
                            src="/placeholder.svg?height=40&width=40"
                            alt="Upload"
                            width={100}
                            height={100}
                          /> */}
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          Drag and drop image here, or click add image
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          Add Image
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#6b614f] hover:bg-[#5c5343]"
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* <Button
            className="bg-[#6b614f] hover:bg-[#5c5343] gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button> */}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b614f]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">
                    Image
                  </th>
                  <th className="text-left p-4 font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left p-4 font-medium text-gray-500">
                    Description
                  </th>
                  <th className="text-center p-4 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedCategories.map((category: Category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="h-16 w-16 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="h-16 w-16 object-cover"
                          height={100}
                          width={100}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <h3 className="font-medium">{category.name}</h3>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {category.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCategory(category._id)
                                }
                                className="bg-red-500 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, categories.length)} of {categories.length}{" "}
                results
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &lt;
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      className={`w-10 h-10 ${
                        currentPage === pageNum
                          ? "bg-[#c9b18d] text-[#6b614f] border-[#c9b18d]"
                          : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10"
                      disabled
                    >
                      ...
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Type category name here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Type category description here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Thumbnail</Label>
              <div className="border rounded-md p-4">
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-40 object-contain"
                      height={400}
                      width={400}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewUrl("");
                        setNewCategory({ ...newCategory, image: null });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      {/* <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Upload"
                        height={100}
                        width={100}
                      /> */}
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Drag and drop image here, or click add image
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      Add Image
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343]"
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <form onSubmit={handleUpdateCategory} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Type category name here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type category description here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Thumbnail</Label>
                <div className="border rounded-md p-4">
                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={editPreviewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-40 object-contain"
                      height={400}
                      width={400}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("edit-image-upload")?.click()
                      }
                    >
                      Change Image
                    </Button>
                    <input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, true)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#6b614f] hover:bg-[#5c5343]"
                  disabled={updateCategoryMutation.isPending}
                >
                  {updateCategoryMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
