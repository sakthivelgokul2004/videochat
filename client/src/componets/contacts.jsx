export function Contact(props) {
  // console.log(props);
  let contact = props.contact;
  return (
    <>
      <div
        className="flex"
        onClick={() => props.handleRoom(contact.userName, props.socketId)}
        key={contact._id}
      >
        <div className="avatar online w-8">
          <div className="w-8 rounded-full">
            <img src={contact.photoUrl} />
          </div>
        </div>
        <a className="hidden md:block">{contact.userName}</a>
      </div>
    </>
  );
}
