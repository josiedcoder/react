import React, { useState } from "react";
import Modal from "react-modal";
import SimpleMap from "../components/SimpleMap";
const MapModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={modalIsOpen}>
      <SimpleMap sendCordinates={getCordinates}></SimpleMap>
      <div style={{ float: "right" }}>
        <button onClick={closeModal}>Close Map</button>
      </div>
    </Modal>
  );
};

export default MapModal;
