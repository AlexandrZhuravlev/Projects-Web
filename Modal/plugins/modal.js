Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() {

}
//создаем для модального окна нижнюю часть, footer
function _createModalFooter(buttons = []) {
    if (buttons.length === 0 ) {
        return document.createElement('div')
    }
    //обложка
    const wrap = document.createElement('div');
    wrap.classList.add('modal-footer');
        buttons.forEach( btn => {
            const $btn = document.createElement('botton')
            $btn.textContent = btn.text;
            $btn.classList.add('btn');
            $btn.classList.add(`btn-${btn.type || 'secondary'}`);
            $btn.onclick = btn.handler || noop;
            wrap.appendChild($btn);
        })
    return wrap;
}
//создаем визуальный стиль модального окна
function _createModal(options) {
    const DEFAULT_WIDTH = '600px';
    const modal = document.createElement('div');
    modal.classList.add('vmodal');
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true"   >
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title || 'Окно'}</span>
                    ${options.closable ? `<span class="modal-close" data-close="true"   >&times;</span>` : ''}
                </div>
                <div class="modal-body" data-content >
                    ${options.content || ''}
                </div>
            </div>
        </div>
    `)
    //создаем футер
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    //добавляем модуль
    document.body.appendChild(modal)   
    return modal;
}

//функция набора действий модального окна
$.modal = function(options) {
    //можем использовать приватные переменные или функции
    const ANIMATION_SPEED = 200;
    const $modal = _createModal(options);
    let closing = false;
    let destroed = false;
    //у модального окна есть несколько методов
    const modal = {
        open() {
            if(destroed) {
                return console.log('Module is destroed')
            }
            //выводит модальное окно
            !closing && $modal.classList.add('open');
        },
        close() {
            closing = true;
            //закрывает модальное окно
            $modal.classList.remove('open');
            $modal.classList.add('hide');
            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false;
                if(typeof options.onClose === 'function') {
                    options.onClose();
                }
            },ANIMATION_SPEED)
        },
        destroy() {}
    }
    //создаем функцию листенер
    const listener = event => {
        if(event.target.dataset.close) {
            modal.close()
        }
    }
    //добавляем слушателя в модал
    $modal.addEventListener('click', listener)

    //добавляем свойства в объект modal (свойство удаления)
    return Object.assign(modal, {
        destroy() {
            //удаляем из дом дерево
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener);
            destroed = true;
        }, // динамически изменяем содержимое модального окна
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html;
        }
    })
    
}