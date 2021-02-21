import React, { render } from "preact/compat";

import "./index.sass";

import { createRef, useState } from "preact/compat";
import { store } from "~/lib/store";

const d = store.get('todo')
const { abs } = Math

interface ITodo {
  title: string
  check: boolean
}

const getItem = (e: HTMLElement): HTMLElement => {
  if (e.classList.contains('item'))
    return e

  if (e == document.body)
    throw new Error('Что-то пошло не так!')

  return getItem(e.parentElement)
}

const getIndexes = (e: HTMLElement, filter: HTMLElement) => {
  return [...e.childNodes].filter(e => {
    if (e == filter) return false
    return e instanceof HTMLElement
  }).map((e: HTMLElement) => +e.style.order)
}

const Todo = () => {
  const input = createRef<HTMLInputElement>()
  const helper = createRef<HTMLDivElement>()
  const [todos, setTodos] = useState<ITodo[]>(d)

  store.set('todo', todos)

  const append = () => {
    const title = input.current.value.trim()
    if (!title) return
    input.current.value = ''
    setTodos([...todos, { title, check: false }])
  }

  const remove = (i = 0) =>
    () => setTodos(todos.filter((e, v) => v != i))

  const onKeyDown = ({ key = '' }) => {
    if (key != 'Enter') return
    append()
  }

  const sort = (v: number[]) => {
    setTodos([...todos].sort((a, b) => {
      let iA = todos.indexOf(a)
      let iB = todos.indexOf(b)
      return v[iA] - v[iB]
    }))
  }

  const onKeydown = (i = 0) =>
    (e: MouseEvent) => {
      e.preventDefault()

      if(e.button != 0) return
      const item = getItem(e.target as HTMLElement)
      const body = item.parentElement as HTMLElement
      const { clientX, clientY, offsetX: oX, offsetY: oY } = e
      const { clientLeft, clientTop } = item
      const cs = getComputedStyle(item)
      const padding = cs.getPropertyValue('padding') 
                   || cs.getPropertyValue('padding-top')
                   
      const minPad = parseFloat(padding)
      const offsetY = clientTop + oY + minPad
      const offsetX = clientLeft + oX + minPad
      let change = false
      let v = 0


      for(let el of body.childNodes) {
        if(el == helper.current) continue
        if(!(el instanceof HTMLElement)) continue
        el.style.order = `${v++}`
      }

      item.classList.add('hidden')
      helper.current.classList.add('active')
      helper.current.innerHTML = item.innerHTML
      helper.current.style.width = `${item.offsetWidth - minPad * 2}px`

      const toPos = (x = 0, y = 0) => {
        helper.current.style.top = `${y - offsetY}px`
        helper.current.style.left = `${x - offsetX}px`
      }

      const cX = clientX
      const cY = clientY

      const move = (m: MouseEvent) => {
        m.preventDefault()
        const { clientX, clientY } = m
        toPos(clientX, clientY)

        if(
          abs(clientX - cX) > 20 || 
          abs(clientY - cY) > 20
        ) change = true

        for (let el of body.childNodes) {
          if (el == helper.current)
            continue

          if (el == item)
            continue

          if (!(el instanceof HTMLElement))
            continue

          const { clientHeight, clientWidth, offsetLeft, offsetTop } = el

          if (clientX < offsetLeft) continue
          if (clientY < offsetTop) continue
          if (clientX > offsetLeft + clientWidth) continue
          if (clientY > offsetTop + clientHeight) continue

          if (+el.style.order == +item.style.order - 1)
            if (clientY < offsetTop + clientHeight * .5) {
              let next = el.style.order
              let now = item.style.order

              item.style.order = next
              el.style.order = now
            }

          if (+el.style.order == +item.style.order + 1)
            if (clientY > offsetTop + clientHeight * .5) {
              let next = el.style.order
              let now = item.style.order

              item.style.order = next
              el.style.order = now
            }
        }
      }

      toPos(clientX, clientY)

      addEventListener('mousemove', move)
      addEventListener('mouseup', () => {
        item.classList.remove('hidden')
        helper.current.classList.remove('active')
        helper.current.innerHTML = ''
        toPos(-100, -100)
        removeEventListener('mousemove', move)
        
        if(!change) check(i)()
        else sort(getIndexes(body, helper.current))

        for(let el of body.childNodes) {
          if(el == helper.current) continue
          if(!(el instanceof HTMLElement)) continue
          el.style.order = null
        }
      }, { once: true })
    }

  const check = (i = 0) =>
    () => setTodos(todos.map((e, v) => v == i ? { ...e, check: !e.check } : e))

  return (
    <div className="todo">
      <div className="head">
        <input placeholder="Введите задачу" onKeyDown={onKeyDown} ref={input} />
        <button onClick={append}>+</button>
      </div>
      <div className="body">
        <div className="item helper" ref={helper}></div>
        {todos.map((e, i) => (
          <div className="item">
            <p className={e.check ? 'check' : 'new'} onMouseDown={onKeydown(i)} /*onClick={check(i)}*/>
              {/* <input disabled checked={e.check} type="checkbox" /> */}
              <b>{i+1}.</b> {e.title}
            </p>

            <button onClick={remove(i)}>
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

render((<Todo />), document.body)