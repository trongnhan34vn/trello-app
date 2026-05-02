import Form from '..'
import userImg from '../../assets/user.png'
import TextField from '../../components/form/TextField'
import MemberCard from '../../components/MemberCard'

const AddMemberForm = () => {
  return (
    <>
      <Form defaultValues={{}} onSubmit={() => {}}>
        <TextField name='search' placeholder='Search member...' />
        <p className='text-text-secondary text-sm font-bold mb-1'>Board Members</p>
        {/* Members */}
        <div>
          {/* Member */}
          <MemberCard image={userImg} name='Nhân Nguyễn' email='trongnhan34vn@gmail.com' roleId={1} />
        </div>
      </Form>
    </>
  )
}

export default AddMemberForm;