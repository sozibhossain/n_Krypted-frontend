import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

function FooterCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/all`)
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return <div>Loading categories...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <ul className="space-y-2 text-gray-300">
        {categories.map((category) => (
          <li key={category._id}>
            <Link href={`/auctions?category=${category.name}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterCategories