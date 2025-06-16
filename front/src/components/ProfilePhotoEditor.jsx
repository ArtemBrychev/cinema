import React, { useState, useCallback } from "react";
import { Image, Button, Modal, Spinner, Alert } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageUtil";

function ProfilePhotoEditor({ src, onImageSelect, onDelete, disabled }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [error, setError] = useState(null);
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Сброс предыдущей ошибки
    setError(null);
    
    if (!file) return;

    // Проверка типа файла
    if (!file.type.match('image/jpeg|image/jpg')) {
      setError("Пожалуйста, выберите файл в формате JPG");
      return;
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`Размер файла не должен превышать ${MAX_FILE_SIZE_MB} МБ`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setError("Ошибка при чтении файла");
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      
      // Проверка размера после обрезки
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`После обрезки размер файла всё ещё превышает ${MAX_FILE_SIZE_MB} МБ`);
        return;
      }
      
      onImageSelect(file);
      setShowCropper(false);
      setImageSrc(null);
    } catch (err) {
      setError("Ошибка при обработке изображения");
      console.error("Crop error:", err);
    }
  };

  return (
    <div className="text-center">
      <Image src={src} roundedCircle width={200} height={200} className="mb-3" />
      
      {/* Блок с ошибками */}
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <div className="d-grid gap-2">
        <Button as="label" variant="outline-primary" disabled={disabled}>
          Изменить фото
          <input 
            type="file" 
            accept=".jpg,.jpeg" 
            hidden 
            onChange={handleFileChange} 
            disabled={disabled} 
          />
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