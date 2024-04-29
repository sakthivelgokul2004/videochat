import useCreateCall from "../hooks/CreateOffer"

export default function Input(){
    const [id]=useCreateCall()

    return<>
    <input type="text" value={id} />
    </>
}