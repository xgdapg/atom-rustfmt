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
            default: 'rustfmt',
            title: 'Path to the rustfmt executable'
        }
    },

    activate(state) {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.workspace.observeTextEditors((textEditor) => {
            this.subscriptions.add(textEditor.onDidSave((event) => {
                if (textEditor.getGrammar().scopeName != 'source.rust') return;
                if (!atom.config.get('rustfmt.fmtOnSave')) return;
                this.format(event.path);
            }));
        }));

        this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="rust"]', 'rustfmt:format', () => {
            let textEditor = atom.workspace.getActiveTextEditor();
            if (textEditor.getGrammar().scopeName != 'source.rust') return;
            textEditor.save();
            if (!atom.config.get('rustfmt.fmtOnSave')) {
                this.format(textEditor.getPath());
            }
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    format(file) {
        new BufferedProcess({command: atom.config.get('rustfmt.binPath'), args: ['--write-mode=overwrite', file]});
    }

};
