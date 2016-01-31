{
  "targets": [
    {
      "target_name": "levenshtein_sse",
      "sources": [
        "src/node-levenshtein-sse.cpp"
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")"],
      "cflags": ['-march=native -DNDEBUG']
    }
  ]
}
