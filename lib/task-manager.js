'use babel';

import TaskManagerView from './task-manager-view';
import { CompositeDisposable } from 'atom';
import NPM from './managers/npm';

export default {

  taskManagerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.taskManagerView = new TaskManagerView(state.taskManagerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.taskManagerView.getElement(),
      visible: false
    });

    this.projectPaths = atom.project.getPaths();
    const npm = new NPM(this.projectPaths);

    npm.on('update', () => {
        
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'task-manager:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.taskManagerView.destroy();
  },

  serialize() {
    return {
      taskManagerViewState: this.taskManagerView.serialize()
    };
  },

  toggle() {
    console.log('TaskManager was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
