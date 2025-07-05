import AddPlaylistView from "@/views/editor/AddPlaylistView.vue";
import AddView from "@/views/editor/AddView.vue";
import CreatePlaylist from "@/views/editor/CreatePlaylist.vue";
import PlaylistView from "@/views/editor/PlaylistView.vue";
import type { RouteRecordRaw } from "vue-router";

const editorRoutes: RouteRecordRaw[] = [
  {
    path: '/editor/:id',
    name: 'editor-playlist',
    component: PlaylistView
  },
  {
    path: '/editor/create',
    name: 'editor-create',
    component: CreatePlaylist
  },
  {
    path: '/editor/add',
    name: 'editor-add',
    component: AddView
  },
  {
    path: '/editor/add/playlist/:id',
    name: 'editor-add-playlist',
    component: AddPlaylistView
  },
]

export default editorRoutes