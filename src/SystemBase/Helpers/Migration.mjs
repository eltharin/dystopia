import { SystemConsts } from "../../SystemConsts.mjs";


export function register(migrationClass, emulatedSystemVersion = null) {
    game.settings.register(SystemConsts.SYSTEMID, "lastSystemVersionMigrated", {
        name: "Version du système pour migration",
        scope: "world",
        config: false,
        type: String,
        default: "0.0.0"
    });

    
    Hooks.once("ready", async () => {
        if(game.user.isGM) {
            const current = emulatedSystemVersion || game.system.version;
            const migrated = game.settings.get(SystemConsts.SYSTEMID, "lastSystemVersionMigrated");

            if (foundry.utils.isNewerVersion(current, migrated)) {
                await migrationClass.migrateSystemVersion(migrated, current);
                await game.settings.set(SystemConsts.SYSTEMID, "lastSystemVersionMigrated", current);
            }
        }
    });
}

export function resetVersion(version) {
    game.settings.set(SystemConsts.SYSTEMID, "lastSystemVersionMigrated", version);
}