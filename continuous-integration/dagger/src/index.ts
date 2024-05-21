/**
 * A generated module for ContinuousIntegration functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */
import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
class ContinuousIntegration {
  /**
   * Returns a container that echoes whatever string argument is provided
   */
  // @func()
  // containerEcho(stringArg: string): Container {
  //   return dag.container().from("alpine:latest").withExec(["echo", stringArg])
  // }
  //
  // /**
  //  * Returns lines that match a pattern in the files of the provided Directory
  //  */
  // @func()
  // async grepDir(directoryArg: Directory, pattern: string): Promise<string> {
  //   return dag
  //     .container()
  //     .from("alpine:latest")
  //     .withMountedDirectory("/mnt", directoryArg)
  //     .withWorkdir("/mnt")
  //     .withExec(["grep", "-R", pattern, "."])
  //     .stdout()
  // }

  /**
   * Build the project's docker image and optionally publish it in a registry.
   *
   * @param repoRootPath
   * @param publishDockerImage
   */
  @func()
  async buildImage(repoRootPath: Directory, publishDockerImage?: string) {
    // const src = dag.host().directory(repoRootPath)
    const builtImage = dag
      .container()
      .build(
        repoRootPath,
        {
          dockerfile: "Dockerfile"
        }
      )
      .withLabel(
        "org.opencontainers.image.source",
        "https://github.com/geobeyond/Arpav-PPCV"
      )

    if (publishDockerImage) {
      const sanitizedName = this._sanitizeDockerImageName(publishDockerImage)
      return await builtImage.publish(sanitizedName)
    }
  }

  _sanitizeDockerImageName(dockerImageName: string): string {
    const host = dockerImageName.substring(0, dockerImageName.indexOf('/'))
    const path = dockerImageName.substring(dockerImageName.indexOf('/'))
    let name = path
    let tag = 'latest'
    if (path.indexOf(':') > -1) {
      const tagIndex = path.indexOf(':')
      name = path.substring(0, tagIndex)
      tag = path.substring(tagIndex + 1)
    }
    return host + name.toLowerCase() + ':' + tag
  }

}
