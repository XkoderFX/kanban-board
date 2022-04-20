import KanbanService from './services/kanban.service';
import KanbanView from './view/kanban.view';


const root = document.querySelector('.kanban') as HTMLElement;
const kanbanView = new KanbanView(root);
