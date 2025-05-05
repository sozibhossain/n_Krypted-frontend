import ContactUsFrom from "@/components/ContactUsFrom"
import PathTracker from "@/Shared/PathTracker"

const page = () => {
  return (
    <div className="mt-28 container ">
      <PathTracker/>
      <ContactUsFrom/>
    </div>
  )
}

export default page