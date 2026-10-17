const std = @import("std");

// Zig 0.14.x: keep ../include beside the zig directory.
pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const sdk = b.createModule(.{
        .root_source_file = b.path("../include/mandagram_plugin.zig"),
    });
    const root = b.createModule(.{
        .root_source_file = b.path("plugin.zig"),
        .target = target,
        .optimize = optimize,
    });
    root.addImport("mandagram_plugin", sdk);
    const lib = b.addLibrary(.{
        .name = "sample_plugin",
        .linkage = .dynamic,
        .root_module = root,
    });
    b.installArtifact(lib);
}
