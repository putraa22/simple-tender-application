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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    if (value) {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const currentTime = `${hours}:${minutes}:${seconds}`

      const dateValue = value.includes('T')
        ? `${value.split('T')[0]}T${currentTime}`
        : `${value}T${currentTime}`
      setGeneralInfo({ date: dateValue })
    } else {
      setGeneralInfo({ date: '' })
    }
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
          type="date"
          value={generalInfo.date ? generalInfo.date.split('T')[0] : ''}
          onChange={handleDateChange}
          placeholder="YYYY-MM-DD"
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
