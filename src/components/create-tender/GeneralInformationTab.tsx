import { FormField } from '../form/FormField'
import { TextAreaField } from '../form/TextAreaField'
import { useCreateTenderStore } from '../../store/createTenderStore'

export function GeneralInformationTab() {
  const { generalInfo, setGeneralInfo } = useCreateTenderStore()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setGeneralInfo({ [name]: value })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gray-50 rounded-lg p-4">
        <FormField
          label="Tender Name"
          name="tenderName"
          value={generalInfo.tenderName}
          onChange={handleInputChange}
          placeholder="Enter tender name"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <FormField
          label="Date"
          name="date"
          type="text"
          value={generalInfo.date}
          onChange={handleInputChange}
          placeholder="Please insert date"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <FormField
          label="Requester Name"
          name="requesterName"
          value={generalInfo.requesterName}
          onChange={handleInputChange}
          placeholder="Please insert your name"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <TextAreaField
          label="Descriptions"
          name="descriptions"
          value={generalInfo.descriptions}
          onChange={handleInputChange}
          placeholder="Please insert descriptions"
        />
      </div>
    </div>
  )
}
