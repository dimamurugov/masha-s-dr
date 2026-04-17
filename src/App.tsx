// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import gf from './assets/giphy.gif'
import gf1 from './assets/giphy (1).gif'
import gf2 from './assets/giphy (2).gif'
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
import gf16 from './assets/giphy (16).gif'
import gf17 from './assets/giphy (17).gif'
import gf18 from './assets/giphy (18).gif'
import gf19 from './assets/giphy (19).gif'
import gf20 from './assets/giphy (20).gif'
import gf21 from './assets/giphy (21).gif'
import gf22 from './assets/giphy (22).gif'
import gf23 from './assets/giphy (23).gif'
import gf24 from './assets/giphy (24).gif'
import gf25 from './assets/giphy (25).gif'
import gf26 from './assets/giphy (26).gif'
import gf27 from './assets/giphy (27).gif'
import gf28 from './assets/giphy (28).gif'
import gf29 from './assets/giphy (29).gif'
import gf30 from './assets/giphy (30).gif'
import gf31 from './assets/giphy (31).gif'
import gf32 from './assets/giphy (32).gif'
import gf33 from './assets/giphy (33).gif'
import gf34 from './assets/giphy (34).gif'
import gf35 from './assets/giphy (35).gif'
import gf36 from './assets/giphy (36).gif'
import gf37 from './assets/giphy (37).gif'
import gf38 from './assets/giphy (38).gif'
import gf39 from './assets/giphy (39).gif'
import gf40 from './assets/giphy (40).gif'
import base from './assets/base.gif'
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
  gf16,
  gf17,
  gf18,
  gf19,
  gf20,
  gf21,
  gf22,
  gf23,
  gf24,
  gf25,
  gf26,
  gf27,
  gf28,
  gf29,
  gf30,
  gf31,
  gf32,
  gf33,
  gf34,
  gf35,
  gf36,
  gf37,
  gf38,
  gf39,
  gf40,
];

const App: React.FC = () => {
  const [images, setImages] = useState<FallingImage[]>([]);
  const [nextId, setNextId] = useState(0);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Refs для контроля анимации
  const animationRef = useRef<number>(null);
  // const lastTimestampRef = useRef<number>(0);
  const isPageVisibleRef = useRef<boolean>(true);
  const lastAddTimeRef = useRef<number>(Date.now());
  
  // Используем ref для хранения текущих изображений без остановки анимации
  const imagesRef = useRef<FallingImage[]>([]);
  
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Функция для получения адаптивного размера картинки
const getAdaptiveSize = () => {
  const width = window.innerWidth;
  if (width < 480) {
    // Маленькие телефоны
    return 80 + Math.random() * 25; // 40-65px
  } else if (width < 768) {
    // Большие телефоны
    return 100 + Math.random() * 30; // 50-80px
  } else if (width < 1024) {
    // Планшеты
    return 155 + Math.random() * 35; // 55-90px
  } else {
    // Десктопы
    return 160 + Math.random() * 40; // 60-100px
  }
};

  // Добавление новой падающей картинки с контролем времени
  const addImage = useCallback(() => {
    const size = getAdaptiveSize() // 200 + Math.random() * 40;
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

  // Анимация падения с использованием requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min(32, currentTime - lastTime); // Ограничиваем максимальный дельта-тайм
      
      if (deltaTime > 0 && isPageVisibleRef.current) {
        setImages(prev => 
          prev
            .map(img => {
              // Если картинка перетаскивается - не двигаем её
              if (img.isDragging) {
                return img;
              }
              // Плавное движение с учетом времени
              const moveDistance = img.speed * (deltaTime / 16);
              return {
                ...img,
                y: img.y + moveDistance,
              };
            })
            .filter(img => img.y < window.innerHeight + img.height)
        );
      }
      
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Добавление новых картинок с контролем времени и видимости
  useEffect(() => {
    let addInterval: number;
    
    const startAddingImages = () => {
      if (addInterval) clearInterval(addInterval);
      
      addInterval = setInterval(() => {
        // Добавляем картинку только если страница видима
        if (isPageVisibleRef.current) {
          // Ограничиваем максимальное количество картинок на экране
          if (imagesRef.current.length < 80) {
            addImage();
          }
        }
      }, 400);
    };
    
    startAddingImages();
    
    return () => {
      if (addInterval) clearInterval(addInterval);
    };
  }, [addImage]);

  // Отслеживание видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      
      // При возвращении на страницу сбрасываем счетчик времени добавления
      if (!document.hidden) {
        lastAddTimeRef.current = Date.now();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Очистка старых картинок при переполнении
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setImages(prev => {
        if (prev.length > 60) {
          // Удаляем самые старые картинки (первые в списке)
          return prev.slice(-50);
        }
        return prev;
      });
    }, 10000); // Проверяем каждые 10 секунд
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Получение координат касания или мыши
  const getClientCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: touch.clientX, y: touch.clientY };
    } else {
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
    
    let clientX, clientY;
    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setDraggedId(id);
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    
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
      {/* Центральная картинка с подписью */}
      <div className="center-container">
        <img 
          src={base} 
          alt="С Днём Рождения"
          className="center-birthday-image"
        />
        <div className="birthday-message">
          <p className="greeting">Маша с днём рождения!</p>
          <p className="wishes">Желаю тебе больше приятных эмоций</p>
          <p className="wishes">в следующем году!</p>
        </div>
      </div>
      
      {/* Падающие картинки */}
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
            touchAction: 'none',
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