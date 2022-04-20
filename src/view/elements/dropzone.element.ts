import KanbanService from '../../services/kanban.service';

export default class DropZone {
  static createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);
    const dropZone = range.createContextualFragment(`
          <li class="column__dropzone"></li>
        `).children[0] as HTMLElement;
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('column__dropzone_active');
    });
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('column__dropzone_active');
    });

    dropZone.addEventListener('drop', (e) => {
      const columnElement = dropZone.closest('.column') as HTMLElement;
      const columnId = Number(columnElement.dataset.id);
      const dropZonesInColumn = Array.from(
        columnElement.querySelectorAll('.column__dropzone')
      );
      const droppedIndex = dropZonesInColumn.indexOf(dropZone);
      const itemId = Number(e.dataTransfer?.getData('text/plain'));
      const droppedElement = document.querySelector(`[data-id="${itemId}"]`)!;
      const insertAfter = dropZone.parentElement?.matches('.item')
        ? dropZone.parentElement
        : dropZone;

      insertAfter.after(droppedElement);

      KanbanService.updateItem(itemId, {
        position: droppedIndex,
        targetColumn: columnId,
      });
      dropZone.classList.remove('column__dropzone_active');
    });

    return dropZone;
  }
}
