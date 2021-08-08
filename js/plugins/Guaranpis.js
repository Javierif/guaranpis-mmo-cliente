/*:
 * @target MZ
 * @plugindesc Plugin exclusivo para Guaranpis.
 * @author Orphus
 * @url https://beta.guaranpis.es
 * 
 * 
 * @command Test plugin from RPG
 * @text Test plugin from RPG
 * @desc PRueba de función desde RPG MAKER
 *
 * @help
 * ============================================================================
 *                                  Guaranpis MMO
 *                                 Version 0.0.1
 *                                    Orphus
 * ============================================================================
 *
 * Plugin exclusivo para el MMO de Guaranpis.
 *
 * 
 *
 * ============================================================================
 *  End of Help File
 * ============================================================================
 *
 * Welcome to the bottom of the Help file. Thanks for reading!
 *
 * https:/beta.guaranpis.es
 *
 */

PluginManager.registerCommand('Guaranpis', 'Test plugin from RPG', function () {
	$gameVariables.value(1)
	$gameVariables.setValue(1,"Orphus");
	alert("PRUEBA");
});
