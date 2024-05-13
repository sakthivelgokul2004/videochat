import { collection, addDoc, updateDoc, onSnapshot,doc,getDoc } from "firebase/firestore"; 
import { db } from "../../firebase.config";
// 3. Answer the call with the unique ID
 
 export default  async function answerCall (pc,callInput)  {

  const callsCollection=collection(db, 'calls');
  const callId = callInput;
  const callDoc = doc(callsCollection,callId)
  const offerCandidates = collection(callDoc,'offerCandidates');
  const answerCandidates = collection(callDoc,'answerCandidates');
  pc.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidates,event.candidate.toJSON());
  };

  const getData = await getDoc(callDoc)
  let  calldata=getData.data()
  const offerDescription = calldata.offer;
  console.log(offerDescription,callId)
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };
 await updateDoc(callDoc,{answer})

 onSnapshot(offerCandidates,(snapshot)=>{

    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
})
// return pc
};