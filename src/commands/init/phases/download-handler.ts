/**
 * Download and extraction phase
 * Handles archive download from GitHub and extraction to temp directory
 */

import { downloadAndExtract } from "@/domains/installation/download-extractor.js";
import { logger } from "@/shared/logger.js";
import { output } from "@/shared/output-manager.js";
import type { InitContext } from "../types.js";

/**
 * Download and extract release archive
 */
export async function handleDownload(ctx: InitContext): Promise<InitContext> {
  if (ctx.cancelled || !ctx.release || !ctx.kit) return ctx;

  // LOCAL FOLDER MODE: Skip download entirely
  if (ctx.isLocalFolder && ctx.extractDir) {
    logger.info("Local folder mode - skipping download");
    output.section("Using Local Folder");
    logger.success(`Source: ${ctx.extractDir}`);
    return ctx; // extractDir already set by selection handler
  }

  const result = await downloadAndExtract({
    release: ctx.release,
    kit: ctx.kit,
    exclude: ctx.options.exclude,
    useGit: ctx.options.useGit,
    isNonInteractive: ctx.isNonInteractive,
  });

  return {
    ...ctx,
    tempDir: result.tempDir,
    archivePath: result.archivePath,
    extractDir: result.extractDir,
  };
}
