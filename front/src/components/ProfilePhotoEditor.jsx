import React, { useState, useCallback } from "react";
import { Image, Button, Modal, Spinner } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageUtil";

function ProfilePhotoEditor({ src, onImageSelect, onDelete, disabled }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "image/jpeg") {
      alert("Пожалуйста, выберите .jpg файл");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    onImageSelect(file);
    setShowCropper(false);
    setImageSrc(null);
  };

  return (
    <div className="text-center">
      <Image src={src} roundedCircle width={200} height={200} className="mb-3" />
      <div className="d-grid gap-2">
        <Button as="label" variant="outline-primary" disabled={disabled}>
          Изменить фото
          <input type="file" accept=".jpg" hidden onChange={handleFileChange} disabled={disabled} />
        </Button>
        <Button variant="outline-danger" onClick={onDelete} disabled={disabled}>
          {disabled ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Удаление...
            </>
          ) : (
            "Удалить фото"
          )}
        </Button>
      </div>

      <Modal show={showCropper} onHide={() => setShowCropper(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Обрезка фото</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCropper(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleCropSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePhotoEditor;
