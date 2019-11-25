<template>
  <div>
    <h2 class="mb-4">Über</h2>

    <p class="lead">
      Vertretungsplan-WebApp <br> des Martin-Andersen-Nexö-Gymnasiums Dresden
    </p>

    <dl>
      <br>
      <dt>Entwickler</dt>
      <dd>Julian Meinking (Abitur 2019)</dd>

      <br>
      <dt>Danksagung</dt>
      <dd>
        Mit freundlicher Unterstützung des Planerteams, <br>
        insbesondere von Herrn Schuster und Herrn Bechstädt.
      </dd>

      <br>
      <dt>Open Source</dt>
      <dd>
        <ul class="list-unstyled mb-0">
          <li><a href="https://github.com/DrJume/vplan-web" target="_blank">
                <Octicon icon="link-external"/> GitHub Repository
              </a>
          </li>
          <li><a href="https://vuejs.org/" target="_blank">
                <Octicon icon="link-external"/> Vue.js
              </a>
          </li>
          <li><a href="https://getbootstrap.com/" target="_blank">
                <Octicon icon="link-external"/> Bootstrap
              </a>
          </li>
          <li><a href="https://octicons.github.com/" target="_blank">
                <Octicon icon="link-external"/> Octicons
              </a>
          </li>
        </ul>
      </dd>

      <br>
      <dt>Lizenz</dt>
      <dd>
        <a href="https://github.com/DrJume/vplan-web/blob/master/LICENSE" target="_blank" class="text-decoration-none">
          <Octicon icon="link-external"/> GNU Affero General Public License v3.0
        </a>
      </dd>

      <br>
      <dt>Version</dt>
      <dd>
        <ul class="list-unstyled mb-0">
          <li><span class="font-weight-light">VPlan-Web {{getVersion()}}</span></li>
          <li>
            <small class="font-weight-light font-italic">
              (Vue.js {{getVersion('vue')}}, Bootstrap {{getVersion('bootstrap')}}, Octicons {{getVersion('@primer/octicons')}})
            </small>
          </li>
        </ul>
      </dd>
    </dl>

  </div>
</template>

<script>
import pkg from '@/../package-lock.json'

export default {
  name: 'About',

  methods: {
    getVersion (module) {
      return module
        ? (pkg.dependencies[module] ? pkg.dependencies[module].version : '')
        : pkg.version
    }
  }
}
</script>
