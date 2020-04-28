//массив с фруктами
let fruits = [
    {id:1, title:'Яблоки', price: 20, img: 'https://e1.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg?1487746348'},
    {id:2, title:'Апельсины', price: 30, img: 'https://m.dom-eda.com/uploads/images/catalog/item/dfc9a3e974/3cbf3bd41c_1000.jpg'},
    {id:3, title:'Манго', price: 40, img: 'https://avatars.mds.yandex.net/get-zen_doc/1362552/pub_5b0a5dcac3321bd7bb35b356_5b0a5eae7425f5d4eab3e0f1/scale_1200'}
]
// возвращает шаблон карточки фрукта
const toHTML = (fruit) => `
<div class="col">
    <div class="card">
        <img class="card-img-top" style="height: 300px;" src="${fruit.img}" alt="${fruit.title}">
        <div class="card-body">
        <h5 class="card-title">${fruit.title}</h5>
        <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
        <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
        </div>
     </div>
</div>

`;

//данная функция рендерит весь список, работает с массивом fruits
function render() {
    const html = fruits.map( fruit => toHTML(fruit)).join(''); //пробегаемся по массиву и возвращаем новый с преобразованием к строке
    document.querySelector('#fruits').innerHTML = html; // вставляем в данном месте в HTML документе наши подготовленные карточки фруктов
}

render();

//создает новое модальное окно
const priceModal = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {text: 'Закрыть', type:  'primary', handler() {
            priceModal.close();
        }}
    ]
})

//добаавлякм документу слушателя на клик
document.addEventListener('click', event => {
    //чтобы отменить дефолтное поведение и не показывался хеш
    event.preventDefault();
    //если по объекту по которому мы кликнули имеется атрибут data-btn
    const btnType = event.target.dataset.btn;
    //добавляем id из объекта по таргету
    const id = +event.target.dataset.id;
    //проверяем,какой именно фрукт мы нашли
    const fruit = fruits.find(f => f.id === id )
    
    //проверка,мы кликнули по цене? должны показать модальное окно
    if(btnType === 'price') {
        //добавляем контент в модальное окно
        priceModal.setContent(`
        <p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>
        `)
        priceModal.open();
    } else if(btnType === 'remove') {
        $.confirm({
            title: 'Вы уверены?',
            content: `<p>Вы удаляете фрукт <strong>${fruit.title}</strong></p>`
        }).then(() => {
            fruits = fruits.filter( f => f.id !== id )
            render();
        }).catch(() => {
            console.log('Cancel')
        })
    }
})