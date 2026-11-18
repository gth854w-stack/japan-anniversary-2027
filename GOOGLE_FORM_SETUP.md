# Experience comparison: Google Form setup

The comparison works without a form. `experiences-config.js` intentionally has an
empty `embedUrl`; the page shows a bilingual unavailable message, no iframe and no
submit control. There is no authorized Google Forms creation tool in this task.
The owner must create and review the real form. No votes have been collected.

## 1. Create one bilingual form

In [Google Forms](https://forms.google.com/), create a blank form in the intended
owner's account. Suggested title:

**Japan 2027 experience preferences / 日本2027体验偏好**

Description:

> Preferences for discussion only; no itinerary changes or bookings. Use a nickname
> if you wish. Do not include contact details, reservation references or other
> personal information. The owner reviews responses privately.
> 仅供讨论偏好，不会更改行程或完成预订。可使用昵称。请勿填写联系方式、预订编号或其他个人信息。回复由所有者私下查看。

Put **both languages in every question and option**. The website language toggle
does not translate a Google Form; keeping one bilingual form also avoids losing
an in-progress response when the comparison language changes.

Create these questions (no default/pre-filled candidate selections):

| Question | Type and choices |
| --- | --- |
| Traveler nickname (optional) / 旅行者昵称（选填） | Short answer, optional. No actual email or full name required. |
| Preferred tea ceremony / 首选茶道体验 | Multiple choice: Camellia Flower / Camellia Flower 茶屋; Tōka-an / 桃花庵; Taihoan / 对凤庵; Undecided / 尚未决定. |
| Preferred matcha or tea-production experience / 首选抹茶或制茶体验 | Multiple choice: Komurasaki An / 小紫庵; Fukujuen Uji Kobo / 福寿园宇治工房; Fukujuen CHA Experience Park (sencha production) / 福寿园 CHA 游学公园（煎茶制作）; Undecided / 尚未决定. |
| Preferred sushi experience / 首选寿司体验 | Multiple choice: Atelier SUSHI / Atelier SUSHI 寿司工坊; musubu professional chef lesson / 结 musubu 专业厨师课程; MOON and BACK / MOON and BACK 寿司体验; Undecided / 尚未决定. |
| Preferred wagyu experience / 首选和牛体验 | Multiple choice: Kōsa / Kōsa 京都餐厅; Mouriya Gion / 祇园莫利亚; Steak Misono Kyoto / 京都御园; Kyoto Green Cuisine (cooking class, different experience) / Kyoto Green Cuisine（料理课，不同体验）; Undecided / 尚未决定. |
| Second choice: tea ceremony (optional) / 茶道第二选择（选填） | Optional dropdown with the same tea candidates, plus None / 无 and Undecided / 尚未决定. |
| Second choice: matcha or tea production (optional) / 抹茶或制茶第二选择（选填） | Optional dropdown with the same matcha candidates, plus None / 无 and Undecided / 尚未决定. |
| Second choice: sushi (optional) / 寿司第二选择（选填） | Optional dropdown with the same sushi candidates, plus None / 无 and Undecided / 尚未决定. |
| Second choice: wagyu (optional) / 和牛第二选择（选填） | Optional dropdown with the same wagyu candidates, plus None / 无 and Undecided / 尚未决定. |
| Wagyu priority (optional) / 和牛体验重点（选填） | Multiple choice: Dinner / 用餐; Watching a chef at a counter / 吧台观看厨师; Hands-on cooking / 亲自烹饪; Undecided / 尚未决定. |
| Notes (optional; no personal details) / 备注（选填；请勿填写个人信息） | Paragraph, optional. |

The four first-choice questions may be required because each includes Undecided.
Keep nickname, second choices, priority and notes optional. Do not use file-upload
questions or add questions asking for emails, travel documents or bookings.

## 2. Keep responses private

In **Settings**:

- **Responses → Collect email addresses:** select **Do not collect**.
- **Responses → Limit to 1 response:** leave off for a simple link-access form
  without required sign-in. If you choose to require sign-in instead, test it on
  each traveler's device; sign-in and email collection are separate settings.
- **Presentation → View results summary:** **off**. This is essential: summaries
  can reveal free-text responses to anyone allowed to respond.
- Use a bilingual confirmation message, for example:
  “Preference received for discussion; no booking was made. / 已收到讨论偏好，未完成任何预订。”

Review the form's **Share / editor access**: keep the owner as the only editor.
Responder access is different from editor access. A public responder link does
not make responses public, but **anyone finding the link can submit**. The website
cannot enforce two-person-only voting. If that matters, choose restricted
responder access for the two travelers instead and test Google sign-in/embedding;
never put their account details in this repository.

Responses can stay in the form's Responses tab. If you link a Google Sheet, keep
its Drive sharing **Restricted**, owned by the same person, and do not publish it
to the web. Do not add response summaries, exports, response URLs, edit-response
links, spreadsheet IDs, personal data, credentials or APIs to this site/repo.

## 3. Enable respondents and obtain the embed URL

1. In the form editor, click **Publish → Manage**. For link-based respondent
   access, set **General access → Anyone with the link** as **Responder**.
   Check your Workspace account allows external respondents. Do not grant editor
   access or enable response summaries. Select **Publish** to enable the form.
   This publishes the Google Form only; it does not deploy the website.
2. In the editor's **More (⋮) → Embed HTML**, copy Google's iframe HTML. Some
   interfaces expose this under **Send → <>** instead.
3. Extract **only the iframe's `src`**, an official HTTPS URL shaped as
   `https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true`.
   `FORM_ID` here is explanatory, not a working value. Do not use the editor
   `/edit` URL, a `forms.gle` short link, an HTML snippet or a pre-filled link.
4. Provide that real responder embed URL for insertion **before merging**, or
   explicitly decide to review/merge a read-only comparison first. No real Form
   URL was provided with issue #3; working voting cannot be verified yet.

Google's instructions: [Publish, share and embed a form](https://support.google.com/docs/answer/2839588?hl=en).
UI guidance checked 2026-11-17 (America/Los_Angeles); account policies may differ.

## 4. Configure and test on this feature branch

Edit **only** `embedUrl` in `experiences-config.js`, setting it to the real `src`
obtained above. The code accepts only Google's `https://docs.google.com` responder
embed path and the single `?embedded=true` query. It derives the external
`viewform` link from the same URL. Do not include answers or private query values.

The page never reads iframe responses, sends votes itself, or displays a success
claim. Browser privacy settings or sign-in may prevent embedding; the external
**Open form / 打开表单** link stays available. Invalid config falls back safely to
an unavailable message. Changing the comparison language preserves the iframe.

Before approval/merge, the owner should:

1. Preview `experiences.html` at 320px, 390px and desktop widths, in both languages.
2. Open the configured embedded form and the external fallback on both travelers'
   devices. Check no email collection, no unexpected organization restriction,
   every candidate, Undecided and second choices, and the bilingual instructions.
3. Submit a **non-sensitive test preference** using the real Form, then check it
   appears only in the owner's Responses tab (and restricted Sheet, if used).
   Check respondents cannot view any response summary or other person's answers.
4. Switch the comparison language during a partially completed response and
   confirm answers remain in place. Try the fallback with third-party cookies
   blocked. Adjust the iframe height in `experiences.css` if needed; nested
   scrolling is expected for a long form and cross-origin height is not readable.
5. Report external-access failures honestly. Stubbed integration tests check URL
   wiring and layout only, not Google's submission or privacy configuration.

Review and merge approval remains with the user. Do not deploy or change Pages
settings as part of configuring this feature branch.
