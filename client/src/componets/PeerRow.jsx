import React from 'react'
import PeerCard from './peerCard'

const PeerRow = ({peers}) => {
  return (
    <>
      {peers.length &&
        peers.map((peer) => {
          return <PeerCard userData={peer.userData} stream={peer.stream} />
        })
      }
    </>
  )
}

export default PeerRow
