#!/bin/bash
# One-time setup: bootstraps the Remotion project at /c/Content-Creation/remotion-project/
# Run this if the project directory doesn't exist yet.

set -e

PROJECT_DIR="/c/Content-Creation/remotion-project"

echo "Setting up Remotion project at $PROJECT_DIR..."

mkdir -p "$PROJECT_DIR/src/compositions"
mkdir -p "$PROJECT_DIR/src/components"

# package.json
cat > "$PROJECT_DIR/package.json" << 'EOF'
{
  "name": "finance-reels-animations",
  "version": "1.0.0",
  "description": "Remotion animations for finance-reels",
  "scripts": {
    "start": "npx remotion studio",
    "build": "npx remotion render",
    "render": "npx remotion render"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "remotion": "^4.0.0",
    "@remotion/cli": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# tsconfig.json
cat > "$PROJECT_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "ES2022"],
    "module": "ESNext",
    "target": "ES2020",
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
EOF

# remotion.config.ts
cat > "$PROJECT_DIR/remotion.config.ts" << 'EOF'
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
EOF

# src/index.ts (entry point)
cat > "$PROJECT_DIR/src/index.ts" << 'EOF'
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
EOF

# src/Root.tsx (empty — compositions registered here per-reel)
cat > "$PROJECT_DIR/src/Root.tsx" << 'EOF'
import React from "react";
// Compositions are added here by the add-animations skill
// Example:
// import { MyReel } from './compositions/MyReel';
// <Composition id="MyReel" component={MyReel} ... />

export const RemotionRoot: React.FC = () => {
  return <></>;
};
EOF

# src/theme.ts
cat > "$PROJECT_DIR/src/theme.ts" << 'EOF'
export const theme = {
  yellow:  '#F5C842',   // buttery yellow — primary accent for numbers/stats
  white:   '#FFFFFF',
  black:   '#111111',   // near-black background
  overlay: 'rgba(17, 17, 17, 0.78)',  // semi-transparent backing for text overlays
};
EOF

echo "Installing dependencies..."
cd "$PROJECT_DIR" && npm install

echo ""
echo "Remotion project ready at $PROJECT_DIR"
echo "Run 'npx remotion studio' from that directory to preview."
