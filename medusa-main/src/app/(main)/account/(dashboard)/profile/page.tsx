import ProfileTemplate from "@modules/account/templates/profile-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your ACME profile.",
}

export default function Profile()
{
  return <ProfileTemplate />
}
