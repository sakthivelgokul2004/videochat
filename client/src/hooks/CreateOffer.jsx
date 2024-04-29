import { collection, addDoc,doc ,setDoc,onSnapshot} from "firebase/firestore"; 
import { db } from "../../firebase.config";
import 'firebase/firestore';
import { useEffect, useState } from "react";
import { usePeerContex } from "../componets/contex/peerContex";

export default  function useCreateCall()  {
  const pc=usePeerContex()
  // Reference Firestore collections for signaling
async function createOffer(){

const callDoc =  doc(db, 'calls','user');
  const offerCandidates = collection(callDoc,'offerCandidates');
  const answerCandidates = collection(callDoc,'answerCandidates');

  

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && addDoc( offerCandidates,event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  // Listen for remote answer
   onSnapshot(callDoc,(snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
   onSnapshot(answerCandidates,(snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
return callDoc.id
}
createOffer()
  // hangupButton.disabled = false;
  return [id]
};
