import { Customer } from "@medusajs/medusa"
import EditAddress from "../address-card/edit-address-modal"
import AddAddress from "../address-card/add-address"
import React from "react"

type AddressBookProps = {
  customer: Omit<Customer, "password_hash">
}

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
        <AddAddress />
        {customer.shipping_addresses.map((address) => {
          return <EditAddress address={address} key={address.id} />
        })}
      </div>
    </div>
  )
}

export default AddressBook
