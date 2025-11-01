<?php
$backend = getenv('BACKEND_URL') ?: 'http://52.205.19.193:5001';
$users = null;
$error = null;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, rtrim($backend, '/') . '/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    $error = 'curl error: ' . curl_error($ch);
} else if ($httpcode >= 400) {
    $error = 'HTTP ' . $httpcode . ' from backend';
} else {
    $users = json_decode($response, true);
}
curl_close($ch);
?>

<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Simple PHP Frontend</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px }
    .meta { margin-bottom: 12px }
    pre { background:#f6f6f6; padding:10px }
  </style>
</head>
<body>
  <h1>Simple PHP Frontend</h1>
  <div class="meta">
    <strong>API source:</strong>
    <a href="<?= htmlspecialchars($backend) ?>" target="_blank"><?= htmlspecialchars($backend) ?></a>
    &nbsp;|&nbsp;
    <a href="<?= htmlspecialchars(rtrim($backend, '/')) ?>/users" target="_blank">/users</a>
    &nbsp;|&nbsp;
    <a href="<?= htmlspecialchars(rtrim($backend, '/')) ?>/health" target="_blank">/health</a>
  </div>

  <?php if ($error): ?>
    <div style="color: red;">
      <strong>Error fetching users:</strong> <?= htmlspecialchars($error) ?>
    </div>
  <?php endif; ?>

  <h2>Users</h2>
  <?php if (is_array($users) && count($users) > 0): ?>
    <ul>
      <?php foreach ($users as $u): ?>
        <li><?= htmlspecialchars($u['name'] ?? json_encode($u)) ?></li>
      <?php endforeach; ?>
    </ul>
    <h3>Raw JSON</h3>
    <pre><?= htmlspecialchars(json_encode($users, JSON_PRETTY_PRINT)) ?></pre>
  <?php else: ?>
    <p>(no users or API unreachable)</p>
    <?php if (!$error): ?>
      <p>Backend returned: <pre><?= htmlspecialchars($response ?? '') ?></pre></p>
    <?php endif; ?>
  <?php endif; ?>

</body>
</html>
