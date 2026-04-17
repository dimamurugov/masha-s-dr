// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import gf from './assets/giphy.gif'
import gf1 from './assets/giphy (1).gif'
import gf2 from './assets/giphy (2).gif'
import gf3 from './assets/giphy (3).gif'
import gf4 from './assets/giphy (4).gif'
import gf5 from './assets/giphy (5).gif'
import gf6 from './assets/giphy (6).gif'
import gf7 from './assets/giphy (7).gif'
import gf8 from './assets/giphy (8).gif'
import gf9 from './assets/giphy (9).gif'
import gf10 from './assets/giphy (10).gif'
import gf11 from './assets/giphy (11).gif'
import gf12 from './assets/giphy (12).gif'
import gf13 from './assets/giphy (13).gif'
import gf14 from './assets/giphy (14).gif'
import './App.css';

interface FallingImage {
  id: number;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  imageUrl: string;
  zIndex: number;
  width: number;
  height: number;
  isDragging?: boolean;
}

// Массив с URL картинок для дня рождения
const IMAGES = [
  gf,
  gf1,
  gf2,
  gf3,
  gf4,
  gf5,
  gf6,
  gf7,
  gf8,
  gf9,
  gf10,
  gf11,
  gf12,
  gf13,
  gf14,
];

const App: React.FC = () => {
  const [images, setImages] = useState<FallingImage[]>([]);
  const [nextId, setNextId] = useState(0);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Используем ref для хранения текущих изображений без остановки анимации
  const imagesRef = useRef<FallingImage[]>([]);
  
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Добавление новой падающей картинки
  const addImage = useCallback(() => {
    const size = 260 + Math.random() * 40;
    const newImage: FallingImage = {
      id: nextId,
      x: Math.random() * (window.innerWidth - size),
      y: -size - Math.random() * 100,
      speed: 0.8 + Math.random() * 2.5,
      rotation: 1, // Math.random() * 360,
      imageUrl: IMAGES[Math.floor(Math.random() * IMAGES.length)],
      zIndex: 1,
      width: size,
      height: size,
      isDragging: false,
    };
    setImages(prev => [...prev, newImage]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  // Анимация падения - теперь НЕ зависит от состояния перетаскивания
  useEffect(() => {
    const interval = setInterval(() => {
      setImages(prev => 
        prev
          .map(img => {
            // Если картинка перетаскивается - не двигаем её
            if (img.isDragging) {
              return img;
            }
            return {
              ...img,
              y: img.y + img.speed,
            };
          })
          .filter(img => img.y < window.innerHeight + img.height)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Добавление новых картинок
  useEffect(() => {
    const addInterval = setInterval(() => {
      addImage();
    }, 600);

    return () => clearInterval(addInterval);
  }, [addImage]);

  // Получение координат касания или мыши
  const getClientCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if ('touches' in e) {
      // Сенсорное событие
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: touch.clientX, y: touch.clientY };
    } else {
      // Событие мыши
      return { x: e.clientX, y: e.clientY };
    }
  };

  // Обработчики drag & drop для мыши и сенсора
  const handleStart = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imgElement = (e.target as HTMLElement).closest('.falling-image');
    if (!imgElement) return;
    
    const rect = imgElement.getBoundingClientRect();
    
    // Получаем координаты в зависимости от типа события
    let clientX, clientY;
    if ('touches' in e) {
      // Сенсорное событие
      const touch = e.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Событие мыши
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setDraggedId(id);
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    
    // Помечаем картинку как перетаскиваемую и поднимаем её
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, isDragging: true, zIndex: 100 } 
        : img
    ));
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (draggedId === null) return;
    
    const coords = getClientCoordinates(e);
    if (!coords) return;
    
    e.preventDefault();
    
    setImages(prev => prev.map(img => {
      if (img.id === draggedId) {
        let newX = coords.x - dragOffset.x;
        let newY = coords.y - dragOffset.y;
        
        // Ограничиваем движение в пределах экрана
        newX = Math.max(0, Math.min(newX, window.innerWidth - img.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - img.height));
        
        return {
          ...img,
          x: newX,
          y: newY,
        };
      }
      return img;
    }));
  }, [draggedId, dragOffset]);

  const handleEnd = useCallback(() => {
    if (draggedId !== null) {
      // Возвращаем картинке нормальное состояние
      setImages(prev => prev.map(img => 
        img.id === draggedId 
          ? { ...img, isDragging: false, zIndex: 1 }
          : img
      ));
      setDraggedId(null);
    }
  }, [draggedId]);

  // Добавляем обработчики для мыши и сенсора
  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [handleMove, handleEnd]);

  return (
    <div className="app">
      <div className="birthday-text">
        <h1>С Днём Рождения!</h1>
        <p className="subtitle">Перетаскивайте картинки пальцем или мышкой ✨</p>
      </div>
      
      {images.map((img) => (
        <img
          key={img.id}
          src={img.imageUrl}
          alt="birthday"
          className={`falling-image ${img.isDragging ? 'dragging' : ''}`}
          style={{
            left: img.x,
            top: img.y,
            width: img.width,
            height: img.height,
            transform: `rotate(${img.rotation}deg)`,
            zIndex: img.zIndex,
            cursor: draggedId === img.id ? 'grabbing' : 'grab',
            touchAction: 'none', // Отключаем стандартную прокрутку на сенсорных экранах
          }}
          onMouseDown={(e) => handleStart(e, img.id)}
          onTouchStart={(e) => handleStart(e, img.id)}
          draggable={false}
        />
      ))}
    </div>
  );
};

export default App;