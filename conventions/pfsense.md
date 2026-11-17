# pfSense Conventions

Applies to pfSense package WebGUI pages (`/usr/local/www/*.php` and the package's `pkg_edit.php` XML). Build every page out of pfSense's own pieces, the way pfSense's own pages are built. When this file doesn't cover something, open the closest official page on a pfSense install (`/usr/local/www/`) and copy its markup. Don't invent a layout.

Reference pages used below, from pfSense CE 2.9.0:
- **Lists and edit pages:** `firewall_aliases.php`, `firewall_aliases_edit.php`, `services_unbound.php`, `services_unbound_host_edit.php`, `system_gateways.php`
- **Settings pages:** `services_unbound_advanced.php`, `system_advanced_admin.php`
- **Search and filter panels:** `pkg_mgr.php`, `status_logs_common.inc`, `diag_tables.php`
- **Status pages:** `status_services.php`, `status_dhcp_leases.php`
- **Framework:** `classes/Form.class.php`, `classes/Form/*.class.php`, `guiconfig.inc`, `head.inc`, `css/pfSense.css`, `js/pfSenseHelpers.js`

## Spacing Model

pfSense sets `.panel-body { padding: 0px; }` (`pfSense.css`), which cancels Bootstrap's 15px. Anything placed directly in `.panel` or `.panel-body` touches the panel edge. The padding comes from the elements pfSense puts inside, so `.panel-body` may only contain:

| Child of `.panel-body`                                       | Padding comes from                                                     |
|--------------------------------------------------------------|------------------------------------------------------------------------|
| `.form-group` rows (from `Form_Section`, or the same markup) | `.form-group { padding: 7px 5px 5px 5px }` plus the `col-sm-*` gutters |
| `.table-responsive > table.table` (or `table.table`)         | `.table > tbody > tr > td { padding: 6px 4px 6px 10px }`               |
| an alert from `print_info_box()`                             | Bootstrap's `.alert { padding: 15px }`                                 |
| `ul.list-group > li.list-group-item`                         | Bootstrap's `.list-group-item { padding: 10px 15px }`                  |

`.content { padding: 10px }` exists, but only dashboard widgets use it. Don't use it on pages.

```html
<!-- BAD: text and a button flush against the panel edge -->
<div class="panel-body">
	<p>Search catalog names.</p>
	<button class="btn btn-primary">Open Catalog</button>
</div>
```

```php
// GOOD: the same content as a Form API row, which renders a padded .form-group
$form = new Form(false);
$section = new Form_Section('Add from Catalog');

$button = new Form_Button('open_catalog', gettext('Open Catalog'), null, 'fa-solid fa-search');
$button->addClass('btn-primary btn-sm');

$section->addInput(new Form_StaticText('Catalog', $button))->setHelp('Search catalog names.');
$form->add($section);

print($form);
```

Prefer the Form API for anything inside a panel. A hand-written `.form-group` row is padded too, but its `.control-label` is only right-aligned inside a `.form-horizontal` ancestor, which the Form API adds. pfSense's own hand-written search panels (`pkg_mgr.php`, `diag_arp.php`) have no such ancestor, so their labels are left-aligned, unlike Form API rows.

Don't add `<style>` blocks or inline styles for spacing. pfSense uses inline styles only for `display: none` before JavaScript runs, cell wrapping or no-wrap, cursor hints and data-driven widths.

A package widget with no pfSense counterpart, such as a card grid, may ship its own stylesheet. It must:
- scope every rule to a package class
- sit inside a padded child from the table above, such as a `.form-group` row
- never restyle pfSense's own classes

## Page Skeleton

```php
$pgtitle = array(gettext('Services'), gettext('Example'), gettext('Lists'));
$pglinks = array('', '/example-lists.php', '@self');
$shortcut_section = 'example';

include('head.inc');

if ($input_errors) {
	print_input_errors($input_errors);
}

if ($savemsg) {
	print_info_box($savemsg, 'success');
}

display_top_tabs($tab_array);

// Panels, forms, action buttons, help.

include('foot.inc');
```

- **Breadcrumbs:** `$pgtitle` is the crumb trail. In `$pglinks`, `""` means no link and `"@self"` links to the current page. On edit pages, link the middle crumbs back to the list page.
- **Messages and tabs:** messages come before `display_top_tabs()`. The tab array holds `array(label, active, url)` entries.
- **Help link:** `head.inc` adds the `?` icon. Don't write one.
- **Scripts:** queue page JavaScript in `events.push(function () { … });`. `foot.inc` runs it after jQuery and the helpers load.

## Forms

Build every settings and edit form with the Form API. Don't hand-write form panels.

```php
$form = new Form(); // Adds the Save button (btn-primary, fa-save) below the last panel.

$section = new Form_Section('General Options');

$section->addInput(new Form_Checkbox(
	'enable',
	'Enable',
	'Enable the service',
	$pconfig['enable'],
));

$section->addInput(new Form_Input(
	'port',
	'Listen Port',
	'number',
	$pconfig['port'],
))->setHelp('The port used for answering queries.');

$form->add($section);
$form->addGlobal(new Form_Input('id', null, 'hidden', $id));

print($form);
```

**Structure**
- Each `Form_Section` renders as `panel panel-default` with a `panel-heading` and `panel-body` full of `.form-group` rows.
- Labels are `col-sm-2 control-label`, and inputs share `col-sm-10`.
- `new Form(false)` has no Save button. Use it for search, filter and selector forms.
- Globals (hidden inputs and extra buttons) render below the last panel, outside it.

**Text and help**
- **Field help:** `->setHelp()` on the input, or on the `Form_Group` for help under the whole row.
- **A paragraph inside a section:** `new Form_StaticText('', '<span class="help-block">…</span>')`.
- **A read-only value in a settings section:** `Form_StaticText($title, $html)`. The `.col-sm-10` padding-top lines it up with the label.

**Fields**
- **Required fields:** start the title with `*`.
- **Several inputs on one row:** use a `Form_Group` with `->setWidth()` on each input. The column widths plus the label's 2 add up to 12.
- **Repeatable rows:** use a `Form_Group` with class `repeatable`, a `btn-warning` `fa-trash-can` Delete button per row, and a global `btn-success addbtn` `fa-plus` add button.

## Lists, Tables and Edit Pages

A list page shows a table panel, then the Add button. Add and the row's pencil open a separate `*_edit.php` page built with the Form API. Saving returns to the list.

```html
<div class="panel panel-default">
	<div class="panel-heading"><h2 class="panel-title"><?=gettext('Block Lists')?></h2></div>
	<div class="panel-body">
		<div class="table-responsive">
			<table class="table table-striped table-hover table-condensed sortable-theme-bootstrap table-rowdblclickedit" data-sortable>
				<thead>
					<tr>
						<th><?=gettext('Name')?></th>
						<th data-sortable="false"><?=gettext('Actions')?></th>
					</tr>
				</thead>
				<tbody>
					<tr class="disabled"> <!-- Disabled items only. -->
						<td><?=htmlspecialchars($name)?></td>
						<td>
							<a class="fa-solid fa-pencil" title="<?=gettext('Edit list')?>" href="example-lists_edit.php?id=<?=$id?>"></a>
							<a class="fa-regular fa-square-check" title="<?=gettext('Enable list')?>" href="?act=toggle&amp;id=<?=$id?>" usepost></a>
							<a class="fa-solid fa-trash-can" title="<?=gettext('Delete list')?>" href="?act=del&amp;id=<?=$id?>" usepost></a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<nav class="action-buttons">
	<a href="example-lists_edit.php" role="button" class="btn btn-success btn-sm">
		<i class="fa-solid fa-plus icon-embed-btn"></i>
		<?=gettext('Add')?>
	</a>
</nav>
```

**Table markup**
- **Classes:** tables always carry `table table-striped table-hover table-condensed`.
- **Sorting:** add `sortable-theme-bootstrap` and `data-sortable` to sort, and give icon and Actions headers `data-sortable="false"`.
- **Double-click to edit:** `table-rowdblclickedit` clicks the row's first `.fa-pencil`, so only add it when every row has one.
- **Disabled items:** the row gets `<tr class="disabled">`.

**Row actions**
- **Markup:** row actions are bare icon anchors with a `title`. The title is the tooltip and the confirm text.
- **POST:** every state-changing link (delete, enable, disable) has `usepost`, which turns it into a POST with the CSRF token. Edit and copy links stay plain GETs.
- **Confirm:** `fa-trash-can` with `usepost` confirms by itself. Other actions that need a confirm add `do-confirm`, and actions with their own confirm add `no-confirm`.
- **Enable and disable icons:** a disabled item shows `fa-regular fa-square-check` (Enable), and an enabled item shows `fa-solid fa-ban` (Disable).

**Empty states and layout**
- **Empty state:** in a table, a `<tr><td colspan="N">No … are configured.</td></tr>` row. With no table, `print_info_box(gettext('No …'), 'warning', false)` in place of the panel, as `diag_tables.php` does. An info box inside a panel body keeps the alert's 20px bottom margin and leaves a blank strip under it. Never show an empty panel.
- **Action buttons:** they go in `<nav class="action-buttons">` right after the panel closes, never inside it.
- **Page-wide settings:** these live on the list page as a Form API section below the tables, with one Save.

## Buttons and Icons

`.icon-embed-btn` forces the icon to `color: white`. Only use it on a coloured button. On `btn-default` or a bare `.btn` the icon is invisible.

```html
<!-- BAD: white icon on a white button -->
<button class="btn btn-default"><i class="fa-solid fa-arrows-rotate icon-embed-btn"></i>Refresh</button>

<!-- GOOD -->
<button class="btn btn-info btn-sm"><i class="fa-solid fa-arrows-rotate icon-embed-btn"></i>Refresh</button>
```

**Form_Button traps**
- `new Form_Button($name, $title, null, $icon)` adds no colour class, so always chain `->addClass('btn-…')`.
- Never pass both a link and an icon: the link form adds `btn-default`, so the icon is white on white.
- `btn-default` is only for buttons without an icon.

| Class         | Use for                                                     |
|---------------|-------------------------------------------------------------|
| `btn-primary` | Save, Search, Import, Export                                |
| `btn-success` | Add, Install, Apply Changes, Apply Filter, Update           |
| `btn-info`    | Clear, Display Advanced, view switches, Refresh             |
| `btn-warning` | Delete a repeatable row inside a form                       |
| `btn-danger`  | Destructive actions on data, such as clearing a whole table |

| Purpose               | FontAwesome 6 icon             |
|-----------------------|--------------------------------|
| Add                   | `fa-solid fa-plus`             |
| Edit                  | `fa-solid fa-pencil`           |
| Delete                | `fa-solid fa-trash-can`        |
| Copy                  | `fa-regular fa-clone`          |
| Save                  | `fa-solid fa-save`             |
| Search                | `fa-solid fa-search`           |
| Clear                 | `fa-solid fa-undo`             |
| Refresh or update     | `fa-solid fa-arrows-rotate`    |
| Filter                | `fa-solid fa-filter`           |
| Advanced              | `fa-solid fa-cog`              |
| Enable (row action)   | `fa-regular fa-square-check`   |
| Disable (row action)  | `fa-solid fa-ban`              |
| Locked or managed row | `fa-solid fa-lock text-danger` |

Use FontAwesome 6 names with a style prefix (`fa-solid`, `fa-regular`). Never use the bare `fa` class or FontAwesome 4 names.

## Search, Filters and Selectors

pfSense has no on/off switch widget and no page that combines a selector, a search box and a group filter. Build those from the patterns below.

**Server-side filter (preferred):** `new Form(false)` with a `Form_Section` and one `Form_Group('')`, from `status_logs_common.inc`. Each field's `setHelp()` is its label. Put the button inside a `Form_StaticText` so it sits on the same row.

```php
$form = new Form(false);
$section = new Form_Section('Search');

$group = new Form_Group('');
$group->add(new Form_Input('q', null, 'text', $query))->setWidth(6)->setHelp('Name or description');

$button = new Form_Button('search', gettext('Search'), null, 'fa-solid fa-search');
$button->addClass('btn-primary btn-sm');

$group->add(new Form_StaticText('', $button));
$section->add($group);
$form->add($section);

print($form);
```

**Selector that reloads the page:** `Form(false)` + a `Form_Section` + a `Form_Group` holding a `Form_Select` (from `diag_tables.php`). JavaScript submits on `change`, and an action button can share the group.

**Client-side search panel:** copy the `pkg_mgr.php` block exactly. It is a `.form-group` with a `col-sm-2` label, a `col-sm-5` input, a `col-sm-2` select, and a `col-sm-3` column holding Search (`btn-primary`, `fa-search`) and Clear (`btn-info`, `fa-undo`). Help goes in `col-sm-10 col-sm-offset-2`.

**On/off choices in a list:** use the row enable/disable icons, or `Form_Checkbox` fields in a form.

## Help Text

| Kind                              | Where                                                                                                      |
|-----------------------------------|------------------------------------------------------------------------------------------------------------|
| Field help                        | `->setHelp()` under the field                                                                              |
| A paragraph inside a form section | `Form_StaticText('', '<span class="help-block">…</span>')`                                                 |
| A short note under a table panel  | `<span class="help-block">` between the panel and its `action-buttons`, outside both                       |
| Longer page help                  | `<div><div class="infoblock">` + `print_info_box($text, 'info', false)` + `</div></div>` below the content |

The `infoblock` stays hidden behind an (i) icon that `pfSenseHelpers.js` adds. Add `blockopen` to show it open. Info boxes used as help pass `false` as the third argument, so they have no close button.

## Dependent Fields

Hide the rows that don't apply instead of showing every field. Run the check once on load and again on every change.

```js
events.push(function () {
	function updateScope() {
		var everyone = $('#everyone').prop('checked');

		hideInput('networks', everyone);
		hideInput('devices', everyone);
	}

	updateScope();
	$('#everyone').click(updateScope);
});
```

A multi-select `Form_Select` (`$allowMultiple = true`) appends `[]` to both its name and its id, so `hideInput('lists', …)` finds nothing. Escape the brackets:

```js
hideInput('lists\\[\\]', anyList); // BAD without the escapes: hideInput('lists', anyList) hides nothing.
```

Helpers from `pfSenseHelpers.js`:
- `hideInput`, `hideCheckbox` and `hideSelect` hide one field's whole row.
- `hideGroupInput` hides one input inside a multi-input row.
- `hideClass` hides everything with a class set in PHP through `->addClass()`.
- `disableInput` disables a field without hiding it.

## Checklist

- Nothing sits directly in `.panel` or `.panel-body`. Every child is a `.form-group` row, a table, an info box or a list group.
- Every settings and edit form is built with the Form API. No form panels are written by hand.
- Page order: `$pgtitle`/`$pglinks`, then `head.inc`, messages, `display_top_tabs()`, content, then `foot.inc`.
- List pages: a table panel, then `<nav class="action-buttons">` Add, with Add and Edit opening a `*_edit.php` page.
- Tables use the standard classes. Disabled rows use `tr.disabled`. Empty tables show a `colspan` row.
- Row actions are titled icon anchors, with `usepost` on every state change.
- `icon-embed-btn` only appears on coloured buttons, and every icon `Form_Button` gets a colour class.
- Icons use FontAwesome 6 names with a style prefix.
- Help goes in `setHelp()`, a `help-block` or an `infoblock`, never as bare text in a panel.
- Dependent fields hide with `pfSenseHelpers.js` inside `events.push`.
- No `<style>` blocks or inline styles for spacing.
