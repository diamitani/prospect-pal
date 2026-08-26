One-line: live-system state with a pulsing dot — top bars, canvas headers, run status.

```jsx
<StatusPill label="Engine ready" tone="verified" />
<StatusPill label="9-node graph connected" onDeep />
```

One per surface. If nothing is actually live, use `<Badge>` instead.
