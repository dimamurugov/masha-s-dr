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

  // Обработчики drag & drop
  const handlePointerDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imgElement = (e.target as HTMLElement).closest('.falling-image');
    if (!imgElement) return;
    
    const rect = imgElement.getBoundingClientRect();
    setDraggedId(id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    // Помечаем картинку как перетаскиваемую и поднимаем её
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, isDragging: true, zIndex: 100 } 
        : img
    ));
  };

  const handlePointerMove = useCallback((e: MouseEvent) => {
    if (draggedId === null) return;
    
    setImages(prev => prev.map(img => {
      if (img.id === draggedId) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
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

  const handlePointerUp = useCallback(() => {
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

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove); // mousemove
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div className="app">
      <div className="birthday-text">
        <h1>С Днём Рождения!</h1>
        <p className="subtitle">Перетаскивайте картинки мышкой ✨</p>
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
          }}
          onPointerDown={(e) => handlePointerDown(e, img.id)}
          draggable={false}
        />
      ))}
    </div>
  );
};

export default App;