#!/bin/bash

# Simple release script for Grain
# Usage: ./scripts/release.sh 1.0.0-alpha.2

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh <version>"
  exit 1
fi

echo "Releasing version $VERSION..."

# Update version in main package.json
npm version $VERSION --no-git-tag-version

# (Optional) Update versions in all packages if not using changesets
# This is a simple implementation; real monorepos might use pnpm version or changesets
echo "Updating workspace packages..."
pnpm -r exec npm version $VERSION --no-git-tag-version

# Commit and Tag
git add .
git commit -m "chore: release v$VERSION"
git tag "v$VERSION"

echo "Pushing to main and tags..."
git push origin main
git push origin "v$VERSION"

echo "Done! GitHub Action will now trigger the NPM publish."
