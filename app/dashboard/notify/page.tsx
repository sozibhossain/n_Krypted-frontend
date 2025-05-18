import Layout from '@/components/dashboard/layout'
import React from 'react'

const page = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span>→</span>
          <span>notify</span>
        </div>
      </div>
    </Layout >
  )
}

export default page
