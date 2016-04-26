'use babel';

import { CompositeDisposable, BufferedProcess } from 'atom';

export default {
    config: {
        fmtOnSave: {
            type: 'boolean',
            default: true,
            title: 'Format on save'
        },
        binPath: {
            type: 'string',
            default: '/usr/local/bin/rustfmt',
            title: 'Path to the rustfmt executable'
        }
    },

    activate(state) {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.workspace.observeTextEditors((textEditor) => {
            this.subscriptions.add(textEditor.onDidSave(this.formatOnSave.bind(this)));
        }));

        this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="rust"]', 'rustfmt:format', () => {
            this.format(atom.workspace.getActiveTextEditor().getPath());
        }))
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    formatOnSave(event) {
        if (atom.config.get('rustfmt.fmtOnSave')) {
            this.format(event.path);
        }
    },

    format(file) {
        console.log(atom.config.get('rustfmt.binPath'), file);
        if (atom.workspace.getActiveTextEditor().getGrammar().scopeName != 'source.rust') return;
        new BufferedProcess({command: atom.config.get('rustfmt.binPath'), args: ['--write-mode=overwrite', file]});
    }

};
