import KanbanService from '../services/kanban.service';
import DropZone from './elements/dropzone.element';

interface ItemViewElements {
  root: HTMLLIElement;
  input: HTMLDivElement;
}

export default class ItemView {
  private elements: ItemViewElements;

  constructor(
    private id: number,
    private content: string,
    private parentElement: HTMLUListElement
  ) {
    const root = this.createRoot() as HTMLLIElement;
    const input = root.querySelector('.item__input') as HTMLDivElement;
    this.elements = {
      root,
      input,
    };
    this._initHandlers();
  }

  private _initHandlers() {
    this.elements.input.addEventListener('blur', this.onBlur.bind(this));
    this.elements.input.addEventListener(
      'dblclick',
      this.onDblClick.bind(this)
    );
    this.elements.root.addEventListener('dragstart', (e) =>
      this.onDragStart(e)
    );
    this.elements.input.addEventListener('drop', (e) => this.onDrop(e));
  }

  onDragStart(e: DragEvent) {
    e.dataTransfer?.setData('text', this.id.toString());
  }
  // drop on the same input (prevent text inserting)
  onDrop(e: DragEvent) {
    e.preventDefault();
  }

  onDblClick() {
    const check = confirm('Are you sure you want to delete this item?');

    if (!check) return;
    KanbanService.deleteItem(this.id);
    this.elements.input.removeEventListener('blur', this.onBlur);
    this.elements.root.remove();
  }

  onBlur() {
    const newContent = this.elements.input.textContent!.trim();
    if (newContent === this.content) {
      return;
    }
    this.content = newContent;
    KanbanService.updateItem(this.id, {
      content: newContent,
    });
  }

  render() {
    this.elements.root.dataset.id = this.id.toString();
    this.elements.root.append(DropZone.createRoot());
    this.elements.input.textContent = this.content;
    this.parentElement.append(this.elements.root);
  }

  createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);
    return range.createContextualFragment(`
      <li class="column__item item" draggable="true">
        <div contenteditable="" class="item__input"></div>
      </li>
    `).children[0];
  }
}
