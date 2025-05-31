document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен и скрипт тоже');
    // Находим все ссылки навигации
    const navLinks = document.querySelectorAll('nav a');
    
    // Добавляем обработчики событий для каждой ссылки
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Код для модального окна
    const aboutSiteBtn = document.getElementById('about-site-btn');
    const aboutSiteModal = document.getElementById('about-site-modal');
    const closeAboutSite = document.querySelector('.close-about-site');
    const music = document.getElementById('background-music');

    if (aboutSiteBtn && aboutSiteModal) {
        music.volume = 0.3;

        aboutSiteBtn.addEventListener('click', function() {
            aboutSiteModal.style.display = 'block';
            setTimeout(() => {
                aboutSiteModal.classList.add('show');
            }, 10);
            music.play();
        });

        if (closeAboutSite) {
            closeAboutSite.addEventListener('click', function() {
                aboutSiteModal.classList.remove('show');
                setTimeout(() => {
                    aboutSiteModal.style.display = 'none';
                }, 300);
                music.pause();
                music.currentTime = 0;
            });
        }

        window.addEventListener('click', function(event) {
            if (event.target === aboutSiteModal) {
                aboutSiteModal.classList.remove('show');
                setTimeout(() => {
                    aboutSiteModal.style.display = 'none';
                }, 300);
                music.pause();
                music.currentTime = 0;
            }
        });
    }

    // Закрываем меню при клике на пункт навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Если есть мобильное меню, закрываем его
            const nav = document.querySelector('nav ul');
            if (window.innerWidth <= 768) {
                nav.style.display = 'none';
                setTimeout(() => {
                    nav.style.display = 'flex';
                }, 100);
            }
        });
    });

    // Оптимизация загрузки изображений
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });

    // Улучшение отзывчивости кнопок для мобильных
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

let cartCount = 0;
let cartItems = [];
let currentProduct = null;

function addToCart(productName, productImage) {
    let existingProduct = cartItems.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cartItems.push({ name: productName, image: productImage, quantity: 1 });
    }
    
    updateCartCount();
    showMiniPopup('Добавлено в корзину!', 'images/0xf09f918b.webp');
}

function createQuantityControls(productName, productCard) {
    // Используем productCard для поиска нужного контейнера
    const container = productCard.querySelector('.quantity-controls-container');
    
    // Проверяем, существуют ли уже контролы для этого размера
    if (container.querySelector(`[data-product="${productName}"]`)) {
        // Если контролы уже существуют, просто показываем их
        const existingControls = container.querySelector(`[data-product="${productName}"]`);
        existingControls.style.display = 'flex';
        return;
    }
    
    // Создаем контролы только если их еще нет
    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    controls.setAttribute('data-product', productName);
    controls.innerHTML = `
        <div class="quantity-label">${productName}</div>
        <button class="quantity-btn minus" onclick="decrementQuantity('${productName}')">-</button>
        <span class="quantity-display" data-product="${productName}">1</span>
        <button class="quantity-btn plus" onclick="incrementQuantity('${productName}')">+</button>
    `;
    
    container.appendChild(controls);
    controls.style.display = 'flex';
}

function incrementQuantity(productName) {
    const product = cartItems.find(item => item.name === productName);
    if (product) {
        product.quantity++;
        updateQuantityDisplay(productName);
        updateCartCount();
    }
}

function decrementQuantity(productName) {
    const product = cartItems.find(item => item.name === productName);
    if (product && product.quantity > 0) {
        product.quantity--;
        if (product.quantity === 0) {
            // Удаляем товар из корзины и элементы управления
            cartItems = cartItems.filter(item => item.name !== productName);
            removeQuantityControls(productName);
        }
        updateQuantityDisplay(productName);
        updateCartCount();
    }
}

function updateQuantityDisplay(productName) {
    const quantityDisplay = document.querySelector(`.quantity-display[data-product="${productName}"]`);
    const product = cartItems.find(item => item.name === productName);
    if (quantityDisplay && product) {
        quantityDisplay.textContent = product.quantity;
    }
}

function removeQuantityControls(productName) {
    const controls = document.querySelector(`.quantity-display[data-product="${productName}"]`);
    if (controls) {
        controls.closest('.quantity-controls').remove();
    }
}

// Единая функция для обновления счетчика корзины
function updateCartCount() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
}

function getProductImage(productName) {
    // Получаем изображение товара на основе его названия
    switch(productName) {
        case 'Футболка с принтом':
            return 'images/Без названия.png';
        case 'Толстовка с принтом':
            return 'images/Без названия3.png';
        case 'Кружка с принтом':
            return 'images/a-mug-with-a-beautiful-background-.png';
        case 'Постер для стены':
            return 'images/wall-poster.png';
        case 'Плюшевая игрушка Kidou Yuuto':
            return 'images/kidou_yuuto_5203862_1.jpg';
        case 'Плюшевая Игрушка Endou Mamoru':
            return 'images/Без названия.jpeg';
        default:
            return '';
    }
}

function showMiniPopup(message, characterImage) {
    const miniPopup = document.getElementById('mini-popup');
    const popupMessage = document.getElementById('popup-message');
    const popupCharacter = document.getElementById('popup-character');

    popupMessage.textContent = message;
    popupCharacter.src = characterImage;
    
    miniPopup.classList.remove('hidden');
    miniPopup.classList.add('show-popup');

    setTimeout(() => {
        miniPopup.classList.remove('show-popup');
        miniPopup.classList.add('hidden');
    }, 3000);
}

// Единая функция для отображения корзины
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    
    cartItemsList.innerHTML = '';
    let totalSum = 0; // Добавляем переменную для общей суммы

    cartItems.forEach(item => {
        const li = document.createElement('li');
        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.style.width = '50px';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';
        
        // Получаем цену товара
        let itemPrice = getItemPrice(item.name, item.size);
        totalSum += itemPrice * item.quantity; // Добавляем к общей сумме

        const itemName = document.createElement('span');
        if (item.size) {
            itemName.textContent = `${item.name.split('(')[0].trim()} - Размер: ${item.size} - ${item.quantity} шт. - ${itemPrice * item.quantity} ₸`;
        } else {
            itemName.textContent = `${item.name} - ${item.quantity} шт. - ${itemPrice * item.quantity} ₸`;
        }
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.className = 'remove-item';
        removeButton.addEventListener('click', () => removeFromCart(item.name));
        
        itemInfo.appendChild(itemName);
        li.appendChild(itemImage);
        li.appendChild(itemInfo);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
    });

    // Добавляем отображение общей суммы
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.textContent = `Итого к оплате: ${totalSum} ₸`;
    cartItemsList.appendChild(totalElement);
    
    cartModal.style.display = 'block';
}

// Добавляем функцию для получения цены товара
function getItemPrice(productName, size) {
    // Цены для плюшевых игрушек
    if (productName.toLowerCase().includes('плюшевая')) {
        switch(size) {
            case '20см': return 3500;
            case '30см': return 4500;
            case '40см': return 5500;
            case '50см': return 7000;
            default: return 3500;
        }
    }
    // Цены для кружек
    else if (productName.includes('Кружка')) {
        switch(size) {
            case '250мл': return 2000;
            case '330мл': return 2500;
            case '400мл': return 3000;
            case '450мл': return 3500;
            default: return 2000;
        }
    }
    // Цены для постеров
    else if (productName.includes('Постер')) {
        switch(size) {
            case 'A4': return 1500;
            case 'A3': return 2500;
            case 'A2': return 3500;
            case 'A1': return 4500;
            case 'A0': return 6000;
            default: return 1500;
        }
    }
    // Цены для футболок и толстовок
    else {
        const isHoodie = productName.includes('Толстовка');
        const basePrice = isHoodie ? 8000 : 5000;
        switch(size) {
            case 'S':
            case 'M': return basePrice;
            case 'L': return basePrice + 500;
            case 'XL': return basePrice + 1000;
            case 'XXL': return basePrice + 1500;
            default: return basePrice;
        }
    }
}

// Единая функция для закрытия модального окна
function closeAboutSiteModal() {
    aboutSiteModal.classList.remove('show');
    setTimeout(() => {
        aboutSiteModal.style.display = 'none';
    }, 300);
    music.pause();
    music.currentTime = 0;
}

// Обработчики событий
document.getElementById('cart-icon').addEventListener('click', showCart);
document.getElementById('cart').addEventListener('click', showCart);

document.getElementById('close-cart').addEventListener('click', function() {
    document.getElementById('cart-modal').style.display = 'none';
});

document.getElementById('clear-cart').addEventListener('click', function() {
    cartItems = [];
    cartCount = 0;
    document.getElementById('cart-count').textContent = cartCount;
    
    // Удаляем старое модальное окно
    document.getElementById('cart-modal').style.display = 'none';
    
    // Показываем обновленное модальное окно
    setTimeout(() => {
        document.getElementById('cart-icon').click();
    }, 0);
});

function updateCartCount() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
}


document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    
    // Добавляем timestamp к пути гифки прямо в HTML
    const timestamp = new Date().getTime();
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="loader-wrapper">
                <img src="images/e1e4afcad3a3d92f24b72c4960084527.gif" 
                     alt="BekishevSHOP Loading" 
                     class="loading-gif" 
                     id="loading-gif">
                <div class="loader-overlay"></div>
            </div>
            <div class="loader-text">
                <h1>BekishevSHOP</h1>
                <div class="loading-bar"></div>
                <p>Загрузка...</p>
            </div>
        </div>
    `;
    document.body.insertBefore(preloader, document.body.firstChild);

    const loadingGif = preloader.querySelector('#loading-gif');
    const loadingBar = preloader.querySelector('.loading-bar');

    // Добавляем случайный параметр к URL гифки для принудительной перезагрузки
    loadingGif.src = loadingGif.src + '?v=' + Math.random();

    const tempImg = new Image();
    tempImg.src = loadingGif.src;
    
    tempImg.onload = function() {
        const gifDuration = 2300;
        
        // Сбрасываем стили загрузочной полосы
        loadingBar.style.width = '0%';
        
        let width = 0;
        const loadingInterval = setInterval(() => {
            if (width >= 100) {
                clearInterval(loadingInterval);
            } else {
                width++;
                loadingBar.style.width = `${width}%`;
            }
        }, gifDuration / 100);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, gifDuration);
    };

    // Добавляем обработчик ошибок
    tempImg.onerror = function() {
        console.error('Ошибка загрузки прелоадера');
        preloader.remove();
    };
});

function removeFromCart(productName) {
    // Находим индекс товара в корзине
    const index = cartItems.findIndex(item => item.name === productName);
    
    if (index !== -1) {
        // Удаляем товар из массива
        cartItems.splice(index, 1);
        
        // Обновляем отображение количества товаров
        updateCartCount();
        
        // Перерисовываем корзину
        showCart();
        
        // Показываем уведомление
        showMiniPopup('Товар удален из корзины', 'images/0xf09f918b.webp');
    }
}

function addToCartWithSize(productName, productImage) {
    const modal = document.getElementById('size-modal');
    const sizeSelect = document.getElementById('modal-size-select');
    
    sizeSelect.innerHTML = '';
    
    let sizes = [];
    if (productName.toLowerCase().includes('плюшевая')) {
        sizes = [
            { value: '20см', label: 'Маленькая (20 см)', price: 3500 },
            { value: '30см', label: 'Средняя (30 см)', price: 4500 },
            { value: '40см', label: 'Большая (40 см)', price: 5500 },
            { value: '50см', label: 'Очень большая (50 см)', price: 7000 }
        ];
    } else if (productName.includes('Кружка')) {
        sizes = [
            { value: '250мл', label: 'Маленькая (250 мл)', price: 2000 },
            { value: '330мл', label: 'Средняя (330 мл)', price: 2500 },
            { value: '400мл', label: 'Большая (400 мл)', price: 3000 },
            { value: '450мл', label: 'Очень большая (450 мл)', price: 3500 }
        ];
    } else if (productName.includes('Постер')) {
        sizes = [
            { value: 'A4', label: 'A4 - 21×29.7 см', price: 1500 },
            { value: 'A3', label: 'A3 - 29.7×42 см', price: 2500 },
            { value: 'A2', label: 'A2 - 42×59.4 см', price: 3500 },
            { value: 'A1', label: 'A1 - 59.4×84.1 см', price: 4500 },
            { value: 'A0', label: 'A0 - 84.1×118.9 см', price: 6000 }
        ];
    } else {
        // Для футболок и толстовок
        const isHoodie = productName.includes('Толстовка');
        const basePrice = isHoodie ? 8000 : 5000; // Базовая цена для толстовок/футболок
        sizes = [
            { value: 'S', label: 'S', price: basePrice },
            { value: 'M', label: 'M', price: basePrice },
            { value: 'L', label: 'L', price: basePrice + 500 },
            { value: 'XL', label: 'XL', price: basePrice + 1000 },
            { value: 'XXL', label: 'XXL', price: basePrice + 1500 }
        ];
    }
    
    // Добавляем опции размеров с ценами
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size.value;
        option.textContent = `${size.label} - ${size.price} ₸`;
        option.dataset.price = size.price;
        sizeSelect.appendChild(option);
    });
    
    currentProduct = { name: productName, image: productImage };
    
    modal.style.display = 'block';
    modal.style.opacity = '1';
}

function updateQuantityControlsVisibility(productName, selectedSize, selectElement) {
    // Находим правильный контейнер через родительский элемент select
    const productCard = selectElement.closest('.product-card');
    const container = productCard.querySelector('.quantity-controls-container');
    if (!container) return;
    
    // Получаем все контролы для данного продукта
    const allControls = container.querySelectorAll('.quantity-controls');
    
    // Скрываем все контролы
    allControls.forEach(controls => {
        controls.style.display = 'none';
    });
    
    // Проверяем, есть ли этот размер в корзине
    const productWithSize = `${productName} (${selectedSize})`;
    const productInCart = cartItems.find(item => item.name === productWithSize);
    
    // Показываем контролы только если товар уже в корзине
    if (productInCart) {
        const selectedControls = container.querySelector(`[data-product="${productWithSize}"]`);
        if (selectedControls) {
            selectedControls.style.display = 'flex';
        }
    }
}

function updateQuantityDisplay(productName, productCard) {
    // Обновляем отображение количества в правильном контейнере
    const quantityDisplay = productCard.querySelector(`.quantity-display[data-product="${productName}"]`);
    const product = cartItems.find(item => item.name === productName);
    if (quantityDisplay && product) {
        quantityDisplay.textContent = product.quantity;
    }
}

// Обновляем функцию инициализации
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Инициализируем отображение контролов количества
    const sizeSelects = document.querySelectorAll('.size-select');
    sizeSelects.forEach(select => {
        const productName = select.id.includes('tshirt') ? 'Футболка с принтом' : 'Толстовка с принтом';
        updateQuantityControlsVisibility(productName, select.value, select);
    });
});

// Обработчики для модального окна размеров
document.addEventListener('DOMContentLoaded', function() {
    const modalQuantityInput = document.getElementById('modal-quantity');
    
    // Кнопка уменьшения количества
    document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
        const currentValue = parseInt(modalQuantityInput.value);
        if (currentValue > 1) {
            modalQuantityInput.value = currentValue - 1;
        }
    });

    // Кнопка увеличения количества
    document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
        const currentValue = parseInt(modalQuantityInput.value);
        if (currentValue < 99) {
            modalQuantityInput.value = currentValue + 1;
        }
    });

    // Кнопка "Отмена"
    document.getElementById('cancel-size-select').addEventListener('click', function() {
        const modal = document.getElementById('size-modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    // Кнопка "Добавить в корзину"
    document.getElementById('add-to-cart-confirm').addEventListener('click', function() {
        if (!currentProduct) return;
        
        const size = document.getElementById('modal-size-select').value;
        const quantity = parseInt(document.getElementById('modal-quantity').value);
        const productWithSize = `${currentProduct.name} (${size})`;
        
        let existingProduct = cartItems.find(item => item.name === productWithSize);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cartItems.push({
                name: productWithSize,
                image: currentProduct.image,
                quantity: quantity,
                size: size
            });
        }
        
        updateCartCount();
        showMiniPopup('Добавлено в корзину!', 'images/0xf09f918b.webp');
        
        // Закрываем модальное окно
        const modal = document.getElementById('size-modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const characterCards = document.querySelectorAll('.character-card');
    const backgroundMusic = document.getElementById('characters-background-music');
    const audioElements = new Map();
    const audioFiles = {
        'kidou': 'audio/kidou.m4a',
        'endou': 'audio/mamoru.m4a',
        'gouenji': 'audio/gouenji.m4a'
    };

    // Создаем кнопку для включения музыки
    const musicButton = document.createElement('button');
    musicButton.className = 'music-toggle-btn';
    musicButton.innerHTML = '🎵 Нажмите для погружения в атмосферу';
    musicButton.style.cssText = `
        position: relative;
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
    `;

    // Добавляем эффект при наведении
    musicButton.addEventListener('mouseover', () => {
        musicButton.style.transform = 'scale(1.05)';
        musicButton.style.backgroundColor = '#45a049';
    });

    musicButton.addEventListener('mouseout', () => {
        musicButton.style.transform = 'scale(1)';
        musicButton.style.backgroundColor = '#4CAF50';
    });

    // Добавляем кнопку в начало секции персонажей
    const charactersSection = document.getElementById('characters');
    charactersSection.querySelector('.container').insertBefore(
        musicButton, 
        charactersSection.querySelector('.character-bio')
    );

    let isMusicPlaying = false;
    backgroundMusic.volume = 0.3;

    // Обработчик клика по кнопке
    musicButton.addEventListener('click', () => {
        if (!isMusicPlaying) {
            backgroundMusic.play();
            musicButton.innerHTML = '🎵 Музыка включена';
            isMusicPlaying = true;
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = '🎵 Нажмите для погружения в атмосферу';
            isMusicPlaying = false;
        }
    });

    // Инициализация аудио персонажей
    characterCards.forEach(card => {
        const characterName = card.querySelector('.character-name').textContent.split(' ')[0].toLowerCase();
        
        if (audioFiles[characterName]) {
            const audio = new Audio(audioFiles[characterName]);
            audio.volume = 0.8;
            audioElements.set(card, audio);

            card.addEventListener('click', () => {
                audioElements.forEach((otherAudio, otherCard) => {
                    if (otherCard !== card) {
                        otherAudio.pause();
                        otherAudio.currentTime = 0;
                        otherCard.classList.remove('active');
                    }
                });

                card.classList.toggle('active');

                const currentAudio = audioElements.get(card);
                if (card.classList.contains('active')) {
                    if (isMusicPlaying) {
                        backgroundMusic.volume = 0.1;
                    }
                    currentAudio.currentTime = 0;
                    currentAudio.play().catch(error => {
                        console.log('Ошибка воспроизведения:', error);
                    });

                    currentAudio.addEventListener('ended', () => {
                        if (isMusicPlaying) {
                            backgroundMusic.volume = 0.3;
                        }
                    }, { once: true });
                } else {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    if (isMusicPlaying) {
                        backgroundMusic.volume = 0.3;
                    }
                }
            });
        }
    });
});

// Массив персонажей с их изображениями
const helpers = [
    { image: 'images/Chibi Characters/29_Kidou_Yuuto_puppet_29_29.webp', character: 'Kidou' },
    { image: 'images/Chibi Characters/29_Endou_Mamoru_puppet_29_29.webp', character: 'Endou' },
    { image: 'images/Chibi Characters/29_Gouenji_Shuuya_puppet_29_29.webp', character: 'Gouenji' }
];

// Массив интересных фактов с привязкой к персонажам
const facts = [
    {
        character: 'Kidou',
        facts: [
            "Я изначально был капитаном команды Teikoku Academy!",
            "Мои очки-googles - это подарок от моей сестры Haruna.",
            "Моя техника 'Illusion Ball' создаёт множественные копии мяча!",
            "Мы с сестрой Haruna были разлучены в детстве после смерти родителей.",
            "Знаете ли вы, что я могу предсказывать движения противника?",
            "Моя стратегия 'Emperor Penguin' была разработана в Teikoku Academy.",
            "Я тренировался в специальной футбольной академии с раннего детства!",
            "Мой плащ стал моей визитной карточкой в команде.",
            "Я горжусь тем, что стал частью команды Raimon!",
            "Моя способность к стратегическому мышлению помогает всей команде.",
            "В Teikoku Academy я научился важности командной работы.",
            "Знаете ли вы, что моё имя 'Kidou' означает 'гений' на японском?",
            "Моя техника 'Death Zone' требует идеальной синхронизации с товарищами.",
            "Я всегда анализирую стратегию противника перед матчем.",
            "Мой стиль игры сочетает интеллект и технику."
        ]
    },
    {
        character: 'Endou',
        facts: [
            "Я унаследовал технику 'God Hand' от моего дедушки!",
            "Я часто тренируюсь с шиной, привязанной к дереву.",
            "Я всегда ношу с собой тетрадь дедушки с секретными техниками!",
            "Знаете ли вы, что я никогда не сдаюсь, даже в самых сложных матчах?",
            "Футбол - это не просто игра, это способ понять друг друга!",
            "Моя техника 'Majin The Hand' появилась в критический момент.",
            "Я стал вратарём благодаря вдохновению от моего дедушки.",
            "Каждая тренировка делает нас сильнее - это мой девиз!",
            "Команда Raimon стала моей второй семьёй.",
            "Я верю, что настоящий футбол объединяет людей!",
            "Знаете ли вы, что моя повязка на голове - это талисман?",
            "Техника 'Nekketsu Punch' родилась из моей страсти к футболу!",
            "Я всегда верю в своих товарищей по команде.",
            "Мой дедушка был легендарным вратарём команды Inazuma Eleven.",
            "Каждый матч - это новая возможность стать сильнее!"
        ]
    },
    {
        character: 'Gouenji',
        facts: [
            "Моя техника 'Fire Tornado' одна из самых мощных в команде!",
            "Я начал играть в футбол снова благодаря Endou.",
            "Моя младшая сестра Yuuka - моя главная поддержка.",
            "Я известен как 'Пламенный Бомбардир' в мире футбола!",
            "Знаете ли вы, что я изначально хотел бросить футбол?",
            "Моя техника 'Bakunetsu Storm' родилась из силы командной работы.",
            "Я тренируюсь каждый день, чтобы стать сильнее.",
            "Мой отец был против того, чтобы я играл в футбол.",
            "Совместная техника с Kidou 'Emperor Penguin No. 2' очень сильная!",
            "Я научился многому, играя в команде Raimon.",
            "Fire Tornado может пробить почти любую защиту!",
            "Моё прозвище 'Flame Striker' появилось в средней школе.",
            "Знаете ли вы, что я раньше играл в другой команде?",
            "Моя сестра Yuuka вдохновляет меня становиться лучше.",
            "Техника 'Bakunetsu Screw' требует особой концентрации."
        ]
    },
    {
        character: 'General',
        facts: [
            "Inazuma Eleven впервые вышла в 2008 году!",
            "В игре более 1000 уникальных персонажей.",
            "Название 'Inazuma' означает 'молния' на японском.",
            "Команда Raimon названа в честь школы, где она базируется.",
            "В серии существует более 300 уникальных техник!",
            "Football Frontier - главный турнир в мире Inazuma Eleven.",
            "Каждая команда имеет свой уникальный стиль игры.",
            "Zeus Junior High использует божественные техники.",
            "Aliea Academy представляет инопланетный футбол!",
            "Техника 'Death Zone' требует трёх игроков для выполнения.",
            "Inazuma Eleven вдохновлена реальным футболом.",
            "В серии есть множество параллельных временных линий.",
            "Каждый сезон представляет новых интересных персонажей.",
            "Многие техники основаны на природных явлениях.",
            "Командные техники сильнее индивидуальных!",
            "В серии есть особые матчи 4 на 4 - 'Battle of Route'.",
            "Некоторые техники можно комбинировать для усиления.",
            "Существует специальная тренировочная машина Inazuma.",
            "Каждая школа имеет свою уникальную форму и эмблему.",
            "В серии есть международные команды со всего мира!"
        ]
    }
];

// Добавим отслеживание использованных фактов
let usedFacts = new Map();

// Флаг для отслеживания активного состояния
let isHelperActive = false;

function showRandomFact() {
    if (isHelperActive) return;

    isHelperActive = true;

    const categories = ['Kidou', 'Endou', 'Gouenji', 'General'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const existingGroup = document.querySelector('.helper-group');
    if (existingGroup) existingGroup.remove();

    if (randomCategory === 'General') {
        const helperGroup = document.createElement('div');
        helperGroup.className = 'helper-group';
        document.body.appendChild(helperGroup);

        const generalFacts = facts.find(f => f.character === 'General').facts;
        const randomFact = generalFacts[Math.floor(Math.random() * generalFacts.length)];

        // Создаем персонажей
        const characters = helpers.map((helper, index) => {
            const character = document.createElement('div');
            character.className = 'helper-character';
            character.innerHTML = `
                <img src="${helper.image}" alt="${helper.character}" class="helper-image">
                ${index === 1 ? `
                    <div class="speech-bubble">
                        <p id="fact-text">${randomFact}</p>
                    </div>
                ` : ''}
            `;
            return character;
        });

        // Добавляем персонажей в группу
        characters.forEach(character => helperGroup.appendChild(character));

        // Анимация появления
        requestAnimationFrame(() => {
            helperGroup.classList.add('show');
            
            setTimeout(() => {
                characters.forEach(char => char.classList.add('show'));
                
                setTimeout(() => {
                    const speechBubble = helperGroup.querySelector('.speech-bubble');
                    if (speechBubble) speechBubble.classList.add('show');
                }, 500);
            }, 100);
        });

        // Анимация исчезновения
        setTimeout(() => {
            const speechBubble = helperGroup.querySelector('.speech-bubble');
            if (speechBubble) {
                speechBubble.classList.add('hide');
                
                setTimeout(() => {
                    characters.forEach(char => char.classList.add('hide'));
                    
                    setTimeout(() => {
                        helperGroup.classList.add('hide');
                        
                        setTimeout(() => {
                            helperGroup.remove();
                            isHelperActive = false;
                        }, 600);
                    }, 300);
                }, 300);
            }
        }, 5000);
    } else {
        // Существующая логика для одного персонажа
        const helper = document.getElementById('helper-character');
        const helperImage = helper.querySelector('.helper-image');
        const speechBubble = helper.querySelector('.speech-bubble');
        const factText = document.getElementById('fact-text');

        const randomHelper = helpers.find(h => h.character === randomCategory);
        const characterFacts = facts.find(f => f.character === randomCategory);
        const randomFact = characterFacts.facts[Math.floor(Math.random() * characterFacts.facts.length)];
        
        helper.classList.remove('show');
        speechBubble.classList.remove('show');
        
        helperImage.src = randomHelper.image;
        factText.textContent = randomFact;
        
        helper.style.display = 'flex';
        
        requestAnimationFrame(() => {
            helper.classList.add('show');
            setTimeout(() => {
                speechBubble.classList.add('show');
            }, 300);
        });

        setTimeout(() => {
            speechBubble.classList.remove('show');
            setTimeout(() => {
                helper.classList.remove('show');
                setTimeout(() => {
                    helper.style.display = 'none';
                    isHelperActive = false;
                }, 500);
            }, 300);
        }, 5000);
    }
}

// Обновляем функцию случайного появления
function randomHelperAppearance() {
    // Проверяем, не активен ли уже помощник
    if (!isHelperActive) {
        const minDelay = 5000;  // Минимальная задержка (5 секунд)
        const maxDelay = 15000; // Максимальная задержка (15 секунд)
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;
        
        console.log('Следующий помощник появится через:', delay/1000, 'секунд');
        
        setTimeout(() => {
            showRandomFact();
            randomHelperAppearance(); // Рекурсивный вызов для следующего появления
        }, delay);
    } else {
        // Если помощник активен, пробуем снова через секунду
        setTimeout(randomHelperAppearance, 1000);
    }
}

// Запускаем появления после полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, запускаем помощника...');
    // Сбрасываем флаг при загрузке страницы
    isHelperActive = false;
    setTimeout(randomHelperAppearance, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
    const characterCards = document.querySelectorAll('.character-card');
    const characterData = {
        'Kidou': {
            name: 'Kidou Yuuto (鬼道 有人)',
            position: 'Полузащитник',
            number: '14',
            image: 'images/inazuma-eleven-ina11 (1).gif',
            chibiImage: 'images/29_Kidou_Yuuto_puppet_29_29.webp',
            techniques: ['Emperor Penguin No. 2', 'Illusion Ball', 'Twin Boost'],
            stats: {
                'Техника': '95/100',
                'Скорость': '85/100',
                'Сила': '78/100',
                'Выносливость': '90/100'
            },
            description: 'Стратегический гений команды Raimon, известный своим тактическим мышлением и способностью читать игру. Носит фирменные очки и плащ.',
            soundFile: 'audio/kidou.m4a'
        },
        'Endou': {
            name: 'Endou Mamoru (円堂 守)',
            position: 'Вратарь/Капитан',
            number: '1',
            image: 'images/inazuma-eleven-ina11 (3).gif',
            chibiImage: 'images/29_Endou_Mamoru_puppet_29_29.webp',
            techniques: ['God Hand', 'Majin The Hand', 'Fist of Justice'],
            stats: {
                'Техника': '88/100',
                'Скорость': '79/100',
                'Сила': '92/100',
                'Выносливость': '95/100'
            },
            description: 'Энергичный капитан команды Raimon, унаследовавший страсть к футболу от своего дедушки. Известен своим неугасающим духом и способностью вдохновлять команду.',
            soundFile: 'audio/mamoru.m4a'
        },
        'Gouenji': {
            name: 'Gouenji Shuuya (豪炎寺 修也)',
            position: 'Нападающий',
            number: '10',
            image: 'images/inazuma-eleven-ina11 (22).gif',
            chibiImage: 'images/29_Gouenji_Shuuya_puppet_29_29.webp',
            techniques: ['Fire Tornado', 'Bakunetsu Storm', 'Maximum Fire'],
            stats: {
                'Техника': '92/100',
                'Скорость': '88/100',
                'Сила': '95/100',
                'Выносливость': '87/100'
            },
            description: 'Легендарный нападающий команды, известный своими мощными огненными ударами. Его младшая сестра Юка является его главной мотивацией.',
            soundFile: 'audio/gouenji.m4a'
        }
    };

    let currentAudio = null;

    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    modal.innerHTML = `
        <div class="character-modal-overlay"></div>
        <div class="character-modal-content">
            <button class="modal-close-btn">&times;</button>
            <div class="character-modal-inner">
                <div class="character-images">
                    <div class="character-main-image"></div>
                    <div class="character-chibi-image"></div>
                </div>
                <div class="character-details">
                    <h2 class="character-name"></h2>
                    <div class="character-position-number">
                        <span class="position"></span>
                        <span class="number"></span>
                    </div>
                    <p class="character-description"></p>
                    <div class="character-stats"></div>
                    <div class="character-techniques">
                        <h3>Техники</h3>
                        <div class="techniques-grid"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Обработчик закрытия модального окна
    const closeModal = () => {
        modal.classList.remove('active');
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        const backgroundMusic = document.getElementById('characters-background-music');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
        }
    };

    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.character-modal-overlay').addEventListener('click', closeModal);

    // Обработчик нажатия клавиши Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Обработчик для карточек персонажей
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            const characterName = this.dataset.character;
            const character = characterData[characterName];
            const backgroundMusic = document.getElementById('characters-background-music');

            // Добавляем проверку загрузки изображения
            console.log('Загружаем изображение:', character.image);

            // Обновляем содержимое модального окна
            const modalContent = modal.querySelector('.character-modal-content');
            const mainImageContainer = modalContent.querySelector('.character-main-image');
            
            // Очищаем контейнер и создаем новый элемент img
            mainImageContainer.innerHTML = '';
            const mainImage = document.createElement('img');
            mainImage.src = character.image;
            mainImage.alt = character.name;
            mainImageContainer.appendChild(mainImage);

            // Добавляем обработчик для проверки загрузки изображения
            const testImage = new Image();
            testImage.onload = () => {
                console.log('Изображение успешно загружено:', character.image);
            };
            testImage.onerror = () => {
                console.error('Ошибка загрузки изображения:', character.image);
            };
            testImage.src = character.image;

            // Остальной код модального окна...
            modalContent.querySelector('.character-chibi-image').style.backgroundImage = `url(${character.chibiImage})`;
            modalContent.querySelector('.character-name').textContent = character.name;
            modalContent.querySelector('.position').textContent = character.position;
            modalContent.querySelector('.number').textContent = `#${character.number}`;
            modalContent.querySelector('.character-description').textContent = character.description;

            // Обновляем статистику
            const statsContainer = modalContent.querySelector('.character-stats');
            statsContainer.innerHTML = Object.entries(character.stats)
                .map(([stat, value]) => {
                    // Извлекаем числовое значение из строки (например, из "95/100" получаем 95)
                    const numericValue = parseInt(value.split('/')[0]);
                    return `
                        <div class="stat-item">
                            <span class="stat-label">${stat}</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${numericValue}%"></div>
                                <span class="stat-value">${value}</span>
                            </div>
                        </div>
                    `;
                }).join('');

            // Обновляем техники
            const techniquesGrid = modalContent.querySelector('.techniques-grid');
            techniquesGrid.innerHTML = character.techniques
                .map(technique => `<div class="technique-item">${technique}</div>`)
                .join('');

            // Воспроизводим звук
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            const audio = new Audio(character.soundFile);
            currentAudio = audio;

            if (backgroundMusic) {
                backgroundMusic.volume = 0.1;
            }

            audio.play().catch(error => {
                console.error('Ошибка воспроизведения звука:', error);
            });

            audio.onended = () => {
                if (backgroundMusic) {
                    backgroundMusic.volume = 0.3;
                }
            };

            // Показываем модальное окно
            modal.classList.add('active');

            // Анимируем появление элементов
            setTimeout(() => {
                statsContainer.querySelectorAll('.stat-fill').forEach(fill => {
                    fill.style.width = fill.style.width;
                });
            }, 100);
        });
    });
});

// Добавьте этот код для оптимизации воспроизведения видео
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    
    // Функция для управления воспроизведением видео
    const handleVideo = (entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    };

    // Создаем наблюдатель для видео
    const videoObserver = new IntersectionObserver(handleVideo, {
        threshold: 0.2
    });

    // Наблюдаем за всеми видео на странице
    videos.forEach(video => {
        videoObserver.observe(video);
    });
});

// Добавьте эту функцию для проверки загрузки изображений
function checkImageExists(url) {
    const img = new Image();
    img.onload = () => console.log(`Изображение ${url} успешно загружено`);
    img.onerror = () => console.error(`Ошибка загрузки изображения ${url}`);
    img.src = url;
}

// Проверяем все пути к изображениям
document.addEventListener('DOMContentLoaded', () => {
    Object.values(characterData).forEach(character => {
        checkImageExists(character.image);
        checkImageExists(character.chibiImage);
    });
});

// Расширяем базовые ответы бота
const botResponses = {
    greeting: [
        "Привет! Я ваш помощник по магазину BekishevSHOP. Чем могу помочь?",
        "Здравствуйте! Я готов помочь вам с выбором товаров и ответить на вопросы.",
        "Добро пожаловать в BekishevSHOP! Как я могу вам помочь сегодня?"
    ],
    products: [
        "В нашем магазине есть футболки, толстовки, кружки, постеры и плюшевые игрушки. Что вас интересует?",
        "Могу рассказать подробнее о любом товаре из нашего ассортимента. Что именно вас интересует?",
        "У нас большой выбор товаров с принтами. Хотите узнать подробнее о конкретном товаре?"
    ],
    prices: [
        "Цены на наши товары начинаются от 1500 ₸ за постеры и до 9500 ₸ за толстовки. Какой товар вас интересует?",
        "У нас очень доступные цены! Например, футболки от 5000 ₸, толстовки от 8000 ₸, кружки от 2000 ₸.",
        "Могу подсказать актуальные цены на любой товар. Что именно вас интересует?"
    ],
    delivery: [
        "Мы осуществляем доставку по всему Казахстану. Обычно это занимает 1-3 рабочих дня.",
        "Доставка доступна во все регионы. Сроки и стоимость зависят от вашего местоположения.",
        "Доставляем заказы курьером или почтой Казахстана. Хотите узнать подробнее о стоимости доставки?"
    ],
    tshirts: [
        "Наши футболки изготовлены из 100% хлопка, доступны размеры от S до XXL. Цены от 5000 ₸.",
        "Футболки с принтами - один из наших самых популярных товаров. Есть разные дизайны и размеры."
    ],
    hoodies: [
        "Толстовки очень качественные и теплые, есть разные размеры. Цены от 8000 ₸.",
        "В наличии толстовки с разными принтами, материал не скатывается после стирки."
    ],
    mugs: [
        "Кружки с принтами - отличный подарок! Цены от 2000 ₸.",
        "Наши кружки можно мыть в посудомоечной машине, принт не стирается."
    ],
    posters: [
        "Постеры печатаются на качественной бумаге, доступны разные размеры. От 1500 ₸.",
        "У нас большой выбор постеров с разными дизайнами, можно выбрать размер под ваш интерьер."
    ],
    plush: [
        "Плюшевые игрушки очень мягкие и качественные, высота 30 см. Цены от 3500 ₸.",
        "Наши плюшевые игрушки - точные копии персонажей, отличное качество пошива."
    ],
    payment: [
        "Мы принимаем оплату картой и наличными при получении.",
        "Можно оплатить заказ онлайн или при получении, как вам удобнее."
    ],
    about_site: [
        "Наш сайт BekishevSHOP - это магазин с уникальными принтами и товарами. У нас есть разделы с товарами, информация о персонажах и удобная система заказа.",
        "На сайте вы найдете каталог товаров, информацию о доставке и оплате, а также интересные факты о персонажах.",
        "BekishevSHOP предлагает удобный интерфейс для выбора и заказа товаров. Вы можете просматривать товары, читать описания и узнавать о персонажах."
    ],
    characters: [
        "В разделе персонажей вы можете узнать интересные факты о каждом герое, увидеть их характеристики и особые способности.",
        "У нас есть подробные описания персонажей с их историей, статистикой и уникальными техниками.",
        "Каждый персонаж имеет свою карточку с детальной информацией, гифками и чиби-версией."
    ],
    navigation: [
        "На главной странице вы найдете основную информацию о магазине и популярные товары.",
        "В разделе 'Продукция' представлен весь ассортимент наших товаров с возможностью фильтрации.",
        "Раздел 'Контакты' содержит всю необходимую информацию для связи с нами."
    ],
    features: [
        "На сайте есть удобная корзина для заказов, система поиска товаров и фильтры по категориям.",
        "Вы можете просматривать анимированные превью товаров и детальные описания каждого продукта.",
        "У нас есть система отображения случайных фактов о персонажах и интерактивные карточки героев."
    ],
    ordering: [
        "Чтобы сделать заказ, добавьте товары в корзину, выберите размер и количество, затем перейдите к оформлению.",
        "При заказе вы можете выбрать удобный способ доставки и оплаты.",
        "После оформления заказа вы получите подтверждение на указанный контакт."
    ],
    contacts: [
        "Вы можете связаться с нами через форму в разделе 'Контакты' или написать в социальные сети.",
        "Наша служба поддержки работает ежедневно и готова ответить на все ваши вопросы.",
        "В разделе контактов указаны все способы связи с нами, включая социальные сети."
    ],
    design: [
        "Все принты разрабатываются нашими дизайнерами с вниманием к деталям.",
        "Мы используем качественные материалы для печати, чтобы принты долго сохраняли свой вид.",
        "Каждый дизайн проходит проверку качества перед тем, как попасть в каталог."
    ],
    help: [
        "Я могу помочь вам с выбором товара, рассказать о доставке и оплате, показать информацию о персонажах.",
        "Спрашивайте меня о товарах, персонажах, способах оплаты и доставки - я с радостью помогу!",
        "Могу подсказать, как оформить заказ, выбрать размер или найти конкретный товар."
    ],
    default: [
        "Извините, я не совсем понял ваш вопрос. Можете переформулировать?",
        "Уточните, пожалуйста, ваш вопрос. Я постараюсь помочь.",
        "Не совсем понял вопрос. Может быть, вас интересуют наши товары или доставка?"
    ]
};

// Функция для получения случайного ответа из массива
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Обновляем функцию определения ответа
function getBotResponse(message) {
    message = message.toLowerCase();
    
    // Проверяем приветствие
    if (message.includes('привет') || message.includes('здравствуй') || message.includes('добрый')) {
        return getRandomResponse(botResponses.greeting);
    }
    
    // Проверяем вопросы о товарах
    if (message.includes('футбол') || message.includes('майк')) {
        return getRandomResponse(botResponses.tshirts);
    }
    if (message.includes('толстовк') || message.includes('худи')) {
        return getRandomResponse(botResponses.hoodies);
    }
    if (message.includes('кружк') || message.includes('чашк')) {
        return getRandomResponse(botResponses.mugs);
    }
    if (message.includes('постер') || message.includes('плакат')) {
        return getRandomResponse(botResponses.posters);
    }
    if (message.includes('игрушк') || message.includes('плюш')) {
        return getRandomResponse(botResponses.plush);
    }
    
    // Проверяем общие вопросы
    if (message.includes('товар') || message.includes('что') || message.includes('ассортимент')) {
        return getRandomResponse(botResponses.products);
    }
    if (message.includes('цен') || message.includes('стоит') || message.includes('стоимость')) {
        return getRandomResponse(botResponses.prices);
    }
    if (message.includes('доставк') || message.includes('привоз') || message.includes('получ')) {
        return getRandomResponse(botResponses.delivery);
    }
    if (message.includes('оплат') || message.includes('платить') || message.includes('карт')) {
        return getRandomResponse(botResponses.payment);
    }
    
    // Добавляем новые проверки
    if (message.includes('сайт') || message.includes('магазин')) {
        return getRandomResponse(botResponses.about_site);
    }
    
    if (message.includes('персонаж') || message.includes('герой') || message.includes('характер')) {
        return getRandomResponse(botResponses.characters);
    }
    
    if (message.includes('навигац') || message.includes('раздел') || message.includes('страниц')) {
        return getRandomResponse(botResponses.navigation);
    }
    
    if (message.includes('функц') || message.includes('возможност') || message.includes('умеет')) {
        return getRandomResponse(botResponses.features);
    }
    
    if (message.includes('заказ') || message.includes('оформ') || message.includes('купит')) {
        return getRandomResponse(botResponses.ordering);
    }
    
    if (message.includes('связ') || message.includes('контакт') || message.includes('поддержк')) {
        return getRandomResponse(botResponses.contacts);
    }
    
    if (message.includes('дизайн') || message.includes('принт') || message.includes('рисун')) {
        return getRandomResponse(botResponses.design);
    }
    
    if (message.includes('помо') || message.includes('помощ') || message.includes('подскаж')) {
        return getRandomResponse(botResponses.help);
    }
    
    // Если не нашли подходящий ответ
    return getRandomResponse(botResponses.default);
}

document.addEventListener('DOMContentLoaded', function() {
    const aiToggleBtn = document.querySelector('.ai-toggle-btn');
    const aiChatContainer = document.querySelector('.ai-chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.ai-chat-input input');
    const sendButton = document.querySelector('.ai-chat-input button');
    const messagesContainer = document.querySelector('.ai-chat-messages');

    // Открытие/закрытие чата
    aiToggleBtn.addEventListener('click', () => {
        aiChatContainer.classList.add('active');
        aiToggleBtn.style.display = 'none';
        // Добавляем приветственное сообщение при открытии чата
        if (messagesContainer.children.length === 0) {
            addMessage(getRandomResponse(botResponses.greeting), true);
        }
    });

    closeChat.addEventListener('click', () => {
        aiChatContainer.classList.remove('active');
        aiToggleBtn.style.display = 'flex';
    });

    // Функция добавления сообщения
    function addMessage(message, isAI = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isAI ? 'ai-message' : 'user-message');
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Обработка отправки сообщения
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, false);
            chatInput.value = '';
            
            // Добавляем эффект набора сообщения
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, true);
            }, 1000);
        }
    }

    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});
