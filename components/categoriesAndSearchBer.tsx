"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, MapPin, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CategoriesAndSearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="container py-3  mt-20">
      <div className="grid grid-cols-4 gap-8">
        {/* Categories Dropdown */}
        <div className="col-span-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white h-[52px] hover:bg-gray-800 hover:text-white w-full justify-between"
              >
                <span>Kategorien</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[270px]">
              <DropdownMenuItem>Kategorie 1</DropdownMenuItem>
              <DropdownMenuItem>Kategorie 2</DropdownMenuItem>
              <DropdownMenuItem>Kategorie 3</DropdownMenuItem>
              <DropdownMenuItem>Kategorie 4</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="col-span-3">
          {/* Search Input */}
          <div className="flex items-center border border-white justify-between rounded-lg">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Walk Through: Durchsuchen"
                className="pl-10 bg-transparent  !text-white border-transparent !pleaceholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Location Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white h-[52px] text-black !rounded-l-none hover:bg-gray-100 border-0 gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>location</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Berlin</DropdownMenuItem>
                <DropdownMenuItem>Hamburg</DropdownMenuItem>
                <DropdownMenuItem>München</DropdownMenuItem>
                <DropdownMenuItem>Köln</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>


      </div>
    </header>
  )
}
