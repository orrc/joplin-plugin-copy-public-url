import joplin from 'api'
import {MenuItemLocation} from '../api/types'

joplin.plugins.register({
  onStart: async () => {
    await Promise.all([false, true].map(async (withMarkdown) => {
      const id = withMarkdown ? `copy-public-url-md` : 'copy-public-url'
      const name = `cmd/${id}`
      await joplin.commands.register({
        name,
        label: withMarkdown ? 'Copy HTTP link as Markdown' : 'Copy HTTP link',
        execute: async (noteIds: string[]) => copyPublicUrl(noteIds, withMarkdown),
      })
      await joplin.views.menuItems.create(id, name, MenuItemLocation.NoteListContextMenu)
    }))
  },
})

async function copyPublicUrl(noteIds: string[], withMarkdown: boolean = false) {
  const noteId = noteIds[0]
  const noteUrl = `https://joplin.orr.dev/note/#${noteId}`
  if (withMarkdown) {
    const note = await joplin.data.get(['notes', noteId])
    await joplin.clipboard.writeText(`[${note.title}](${noteUrl})`)
  } else {
    await joplin.clipboard.writeText(noteUrl)
  }
}
