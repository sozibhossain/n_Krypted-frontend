
import React from 'react'
import BlogDetails from './_components/blogDetails'
import { PageHeader } from '@/Shared/PageHeader'


const Page = (props: { params: { id: string } }) => {
    return (
        <section>
            <PageHeader
                title="Blog PDetails"
                items={[
                    {
                        label: "Home",
                        href: "/",
                    },
                    {
                        label: "blogs",
                        href: "/blogs",
                    },
                ]}
            />
            <div className="container">
                <BlogDetails id={props.params.id} />
            </div>
        </section>


    )
}

export default Page