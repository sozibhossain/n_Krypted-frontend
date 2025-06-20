
import React from 'react'
import BlogDetails from './_components/blogDetails'



const Page = (props: { params: { id: string } }) => {
    return (
        <section>
         
            <div className="container">
                <BlogDetails id={props.params.id} />
            </div>
        </section>


    )
}

export default Page