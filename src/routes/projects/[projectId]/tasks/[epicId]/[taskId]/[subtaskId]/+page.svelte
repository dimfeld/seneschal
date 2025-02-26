<!-- Display a subtask and its plan -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { page } from '$app/state';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { superForm } from 'sveltekit-superforms/client';
  import { enhance as skEnhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  let { data } = $props();
  const form = superForm(data.form, {
    resetForm: false,
  });

  const { form: formData, enhance, delayed } = form;

  let generatingPlan = $state(false);
  let showDeleteConfirm = $state(false);

  function confirmDelete() {
    showDeleteConfirm = true;
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      form.submit();
    }
  }}
/>

<form
  method="POST"
  action="?/generatePlan"
  use:skEnhance={() => {
    generatingPlan = true;
    return ({ update }) => {
      generatingPlan = false;
      void update({
        invalidateAll: true,
      });
    };
  }}
></form>

<form method="POST" id="deleteSubtask" action="?/delete"></form>

<form
  method="POST"
  class="flex h-full flex-col gap-4 overflow-y-auto px-4 py-4"
  action="?/save"
  use:enhance
>
  <div class="flex items-center justify-between gap-4">
    <Input
      name="title"
      class="text-2xl font-bold"
      bind:value={$formData.title}
      placeholder="Subtask Title"
    />
    <div class="flex gap-2">
      <Button type="submit" form="generatePlan" disabled={generatingPlan} variant="outline">
        {generatingPlan ? 'Generating...' : 'Generate Plan'}
      </Button>
      <Button type="submit" disabled={$delayed}>
        {$delayed ? 'Saving...' : 'Save'}
      </Button>
      <Button type="button" variant="destructive" onclick={confirmDelete}>Delete Subtask</Button>
    </div>
  </div>

  <Textarea
    name="description"
    bind:value={$formData.description}
    placeholder="Subtask description"
  />

  <Textarea
    name="content"
    class="min-h-96 flex-1"
    bind:value={$formData.content}
    placeholder="Subtask plan content"
  />
</form>

<AlertDialog.Root bind:open={showDeleteConfirm}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete Subtask</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to delete this subtask? This cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={() => (showDeleteConfirm = false)}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action type="submit" form="deleteSubtask">Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
