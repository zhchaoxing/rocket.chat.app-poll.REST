import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { createPollModal } from './lib/createPollModal';

export class PollCommand implements ISlashCommand {
    public command = 'poll';
    public i18nParamsExample = 'params_example';
    public i18nDescription = 'cmd_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const triggerId = context.getTriggerId();

        const data = {
            room: (context.getRoom() as any).value,
            threadId: context.getThreadId(),
        };

        //const question = context.getArguments().join(' ');
        const params_REST = context.getArguments().join(' ').split("|");
        
        if (triggerId) {
            if (params_REST.length === 1)
            {
                const modal = await createPollModal({ question, persistence: persis, data, modify});
                await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
            } else
            {
                const question = params_REST[0]; //Qeustion
                const options = params_REST[3]; //# of options
                const rest = true; //By REST api?
                const singleChoice = (params_REST[1] === "S"); // Is it a single choice [S] vote, not a multiple choice [M] one?
                const confidential = (params_REST[2] === "C"); // Is it a confidential [C] vote, not a open vote [O] one?
                var set = [];
                for(i = 4; i < params_REST.length; i++)
                {
                    set.push(params_REST[i]);
                }
                const option_set = set;
                const modal = await createPollModal({ question, persistence: persis, data, modify, options, rest, singleChoice, confidential, option_set});
                await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
            }
        }
    }
}
