One-line: dropdown for tool-stack choices (CRM, enrichment, sequencer, LLM provider).

```jsx
<Select value={crm} onChange={setCrm} options={[{value:"hubspot",label:"HubSpot CRM (OAuth2)"}]} />
```

Labels carry the auth mode in parentheses so the credential story is visible before deploy.
